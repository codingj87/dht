# -*- coding: utf-8 -*-
import re, xlwt
from xlwt import Workbook, Font, Pattern, XFStyle, Alignment
from . import templatefile


class Excel:
    def __init__(self):
        self.book = Workbook(encoding='utf-8')
        self.sheet_cnt = 0

    def add_sheet(self, title='', settings=None, rs=None, options=None, desc=''):
        if settings is None:
            settings = []

        if rs is None:
            rs = []

        self.sheet_cnt += 1
        if not title:
            title = 'Sheet%d' + self.sheet_cnt
        sheet = self.book.add_sheet(title, cell_overwrite_ok=True)

        # column title
        style = self.get_title_style(center=False)
        row = 0

        if desc:
            sheet.write(row, 0, desc, style)
            sheet.row(row).set_style(style)
            row += 1

        style = self.get_title_style()
        for col, (column_title, _, width) in enumerate(settings):
            sheet.write(row, col, column_title, style)
            sheet.col(col).width = width*32  #0x0d00 + width

        sheet.row(row).set_style(style)
        row += 1

        style = XFStyle()
        style.alignment.wrap = 1
        style.alignment.vert = Alignment.VERT_CENTER
        style.alignment.horz = Alignment.HORZ_CENTER

        columns = [x[1] for x in settings]  # column keys
        if title == 'IP 풀 설정':        # 셀 병합(merge) 방식
            for r in rs:
                cnt_merge = 0
                value_col_0 = ''
                value_col_1 = ''
                for col, column in enumerate(columns):
                    value = r.get(column)
                    if col == 0:
                        value_col_0 = value
                    elif col == 1:
                        value_col_1 = value

                    if len(value.split('<br>')) > 1:
                        cnt_merge = len(value.split('<br>'))
                        for v in value.split('<br>'):
                            sheet.write(row, col, v, style)
                            row += 1
                        row -= cnt_merge
                    else:
                        sheet.write(row, col, value, style)

                if cnt_merge > 0:
                    sheet.write_merge(row, row + cnt_merge - 1, 0, 0, value_col_0, style)
                    sheet.write_merge(row, row + cnt_merge - 1, 1, 1, value_col_1, style)
                    row += cnt_merge
                else:
                    row += 1
        elif title == 'IP 할당 현황':      # '\n' 방식
            for r in rs:
                for col, column in enumerate(columns):
                    value = r.get(column)
                    if len(value.split('<br>')) > 1:
                        row_height = 0
                        tmp_value = ''
                        for v in value.split('<br>'):
                            row_height += 1
                            if row_height > 1:
                                tmp_value += '\n'
                            tmp_value += v
                        value = tmp_value
                        sheet.row(row).height = row_height * 280
                    sheet.write(row, col, value, style)
                row += 1
        elif title == '작업 이력':
            for r in rs:
                for col, column in enumerate(columns):
                    value = r.get(column)
                    if (col == 4) or (col == 5):
                        if value is not None:
                            row_height = 0
                            tmp_value = ''
                            p = re.compile('(dynamic|manual)-dht')
                            for v in value:
                                if p.search(v):
                                    row_height += 1
                                    if row_height > 1:
                                        tmp_value += '\n'
                                    tmp_value += re.sub('[}{]', '', v)
                            value = tmp_value
                            sheet.row(row).height = row_height * 300
                    sheet.write(row, col, value, style)
                row += 1
        elif title == '시스템 로그':
            for r in rs:
                for col, column in enumerate(columns):
                    value = r.get(column)
                    if col == 3:
                        sheet.write(row, col, value, xlwt.easyxf('align: horiz left, vertical center'))
                    else:
                        sheet.write(row, col, value, style)
                    sheet.row(row).height = 800
                row += 1
        else:
            for r in rs:
                for col, column in enumerate(columns):
                    value = r.get(column)
                    sheet.write(row, col, value, style)
                row += 1
        return sheet

    def get_title_style(self, center=True):
        pat = Pattern()
        pat.pattern = Pattern.SOLID_PATTERN
        pat.pattern_fore_colour = 0x16

        font = Font()
        font.bold = True

        align = Alignment()
        if center:
            align.horz = Alignment.HORZ_CENTER
        align.vert = Alignment.VERT_CENTER

        style = XFStyle()
        style.font = font
        style.pattern = pat
        style.alignment = align

        return style

    def get_style(self, font_name=None, font_style=None, align=None, bgcolor=None):
        style = XFStyle()
        if bgcolor:
            pat = Pattern()
            pat.pattern = Pattern.SOLID_PATTERN
            pat.pattern_fore_colour = bgcolor #0x16
            style.pattern = pat

        if font_name or font_style:
            font = Font()
            font.bold = True
            style.font = font

        if align:
            align = Alignment()
            align.horz = Alignment.HORZ_CENTER
            align.vert = Alignment.VERT_CENTER
            style.alignment = align

        return style

    def save(self):
        buf = templatefile.create_byte()
        self.book.save(buf)
        return buf, 'xls'

# END
