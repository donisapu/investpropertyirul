<?php

namespace App\Support;

use RuntimeException;
use ZipArchive;

/**
 * Minimal .xlsx writer (one sheet, bold header row), so exports open cleanly
 * in Excel without a spreadsheet library. Text is written as inline strings,
 * which Excel never evaluates as formulas.
 */
final class SimpleXlsxWriter
{
    /**
     * @param  list<string>  $headers
     * @param  iterable<list<string|int|float|null>>  $rows
     */
    public static function write(string $path, array $headers, iterable $rows, string $sheetName = 'Sheet1'): void
    {
        $sheetFile = tempnam(sys_get_temp_dir(), 'xlsx');
        $out = fopen($sheetFile, 'wb');

        if ($out === false) {
            throw new RuntimeException('Cannot create a temporary sheet file.');
        }

        try {
            fwrite($out, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                .'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>');
            fwrite($out, self::row(1, $headers, bold: true));

            $r = 1;
            foreach ($rows as $row) {
                fwrite($out, self::row(++$r, $row));
            }

            fwrite($out, '</sheetData></worksheet>');
        } finally {
            fclose($out);
        }

        $zip = new ZipArchive;
        if ($zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            @unlink($sheetFile);
            throw new RuntimeException("Cannot create {$path}.");
        }

        $zip->addFromString('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            .'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            .'<Default Extension="xml" ContentType="application/xml"/>'
            .'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            .'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            .'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            .'</Types>');
        $zip->addFromString('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            .'</Relationships>');
        $zip->addFromString('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            .'<sheets><sheet name="'.self::escape(mb_substr($sheetName, 0, 31)).'" sheetId="1" r:id="rId1"/></sheets></workbook>');
        $zip->addFromString('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
            .'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
            .'</Relationships>');
        $zip->addFromString('xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            .'<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
            .'<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>'
            .'<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
            .'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            .'<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>'
            .'</styleSheet>');
        $zip->addFile($sheetFile, 'xl/worksheets/sheet1.xml');
        $zip->close();

        @unlink($sheetFile);
    }

    private static function row(int $index, array $cells, bool $bold = false): string
    {
        $xml = '<row r="'.$index.'">';
        $col = 0;

        foreach ($cells as $value) {
            $ref = self::column($col++).$index;
            $style = $bold ? ' s="1"' : '';

            if (is_int($value) || is_float($value)) {
                $xml .= '<c r="'.$ref.'"'.$style.'><v>'.$value.'</v></c>';
            } elseif ($value === null || $value === '') {
                $xml .= '<c r="'.$ref.'"'.$style.'/>';
            } else {
                $xml .= '<c r="'.$ref.'" t="inlineStr"'.$style.'><is><t xml:space="preserve">'.self::escape((string) $value).'</t></is></c>';
            }
        }

        return $xml.'</row>';
    }

    /** 0 -> A, 25 -> Z, 26 -> AA */
    private static function column(int $i): string
    {
        $name = '';
        for ($i++; $i > 0; $i = intdiv($i - 1, 26)) {
            $name = chr(65 + ($i - 1) % 26).$name;
        }

        return $name;
    }

    private static function escape(string $value): string
    {
        // Drop characters XML 1.0 does not allow (they would corrupt the file).
        $value = preg_replace('/[^\x{9}\x{A}\x{D}\x{20}-\x{D7FF}\x{E000}-\x{FFFD}]/u', '', $value) ?? '';

        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
