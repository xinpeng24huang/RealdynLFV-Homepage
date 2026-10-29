# GitHub Pages maintenance

This repository contains a lightweight static project site. The current deployment target is the personal project repository `WaterPig02/RealdynLFV-Homepage`, not the account's root homepage. The expected project address is `https://waterpig02.github.io/RealdynLFV-Homepage/`; a deployment must complete before that address is treated as live.

## Branch deployment

Build `index.html` with `python3 scripts/build.py`, then run `python3 scripts/check.py`. Review and commit the generated page alongside its sources. In repository Settings → Pages, select **Deploy from a branch**, branch `main`, folder `/(root)`, and Save. `.nojekyll` is included. Wait for the Pages deployment to succeed, then check the exact URL GitHub reports, including CSS/favicon loading and mobile navigation.

No custom workflow, OIDC configuration, custom domain, database or paid service is needed for this public static project site. GitHub Free supports Pages from public repositories, including public organization repositories. Private repository hosting has different plan requirements. [Official availability and site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Documentation checked 2026-10-21.

## Stable links and future organization ownership

Project sites use `https://<owner>.github.io/<repository>/`. Organization root sites instead require a repository named `<organization>.github.io` and occupy the organization's root homepage. Prefer a project repository if moving this project to shared organization ownership later. Choose names before citing a permanent URL; renames and transfers can change the address. Do not assume a future organization name or URL already exists. [Official site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Routine organization editors can receive Write access. Maintain can configure the Pages publishing source; reserve Admin for sensitive settings and access management. [Official repository role matrix](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization). Team access controls are included in [GitHub Free for organizations](https://docs.github.com/get-started/learning-about-github/githubs-products).

Host large datasets separately. Update verified version-specific download and citation links in `content.json`, rebuild and review the page, then push the approved changes. Source-branch publishing redeploys automatically once configured. Do not place full datasets in this site repository. [Official Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
