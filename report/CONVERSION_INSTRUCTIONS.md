# Converting FinalReport.md to Word Document

## Option 1: Direct Open in Microsoft Word (Easiest)

1. Open Microsoft Word
2. Go to **File** → **Open**
3. Navigate to the `report` folder
4. Select `FinalReport.md`
5. Word will automatically convert the markdown to formatted text
6. Review and adjust formatting as needed
7. Save as `Final report.docx` (File → Save As → Choose Word Document format)

## Option 2: Using Pandoc (If Installed)

If you have Pandoc installed:

```bash
cd report
pandoc FinalReport.md -o "Final report.docx" --reference-doc=reference.docx
```

(You can create a reference.docx with your preferred formatting)

## Option 3: Online Converters

1. Use online markdown to Word converters:
   - https://www.markdowntoword.com/
   - https://cloudconvert.com/md-to-docx
   - https://convertio.co/md-docx/

2. Upload `FinalReport.md`
3. Download the converted `.docx` file
4. Save as `Final report.docx` in the report folder

## Option 4: Copy-Paste Method

1. Open `FinalReport.md` in a markdown viewer (VS Code, GitHub, etc.)
2. Copy the formatted content
3. Paste into a new Word document
4. Adjust formatting as needed
5. Save as `Final report.docx`

## Recommended: Option 1

Microsoft Word (2016 and later) can open markdown files directly and convert them to formatted Word documents. This is the easiest method.

## Formatting Tips After Conversion

After converting, you may want to:
- Adjust heading styles
- Add page numbers
- Set margins (1 inch recommended)
- Add header/footer with your name and page numbers
- Check table of contents (Word can auto-generate from headings)
- Ensure consistent font (Times New Roman or Arial, 12pt)
- Add your name, institution, and date on the title page

