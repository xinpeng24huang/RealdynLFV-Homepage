# Deployment and maintenance

The permanent project address is **https://xinpeng24huang.github.io/RealdynLFV-Homepage/**.
The repository is **https://github.com/xinpeng24huang/RealdynLFV-Homepage**.

## Preview and release

1. Check `git remote -v` and the working branch. The remote owner must be `xinpeng24huang`.
2. Edit `content.json`, `template.html`, styles and scripts as needed.
3. Run `python scripts/build.py` and `python scripts/check.py`.
4. Review English and Chinese pages on desktop and mobile, including videos and view controls.
5. Obtain the author's approval to publish the reviewed preview.
6. Commit the content sources, generated `index.html` and `zh.html`, and reviewed web assets together.
7. Publish the approved commit to the official repository's `main` branch. Pages serves `main` at `/(root)` and deploys committed files automatically; it does not execute Python.
8. After deployment succeeds, check the permanent URL, both languages, assets, playback and mobile layout. Compare served HTML to the approved build.

Keep the repository name and owner unchanged so the URL cited in the paper stays valid. Use relative internal URLs for project-subdirectory hosting.

## Content scope

The site currently provides the project introduction, selected scene samples, temporal and angular explorers, paper pipeline and citation. Full dataset release is planned after acceptance of the journal extension. Add public paper or data links when their versions and destinations are confirmed. Keep raw data, private notes, temporary QA artifacts and full local packages outside the repository.

The citation records the accepted VCIP 2026 paper. Add DOI and proceedings page numbers when assigned. Dataset licensing remains an author decision.
