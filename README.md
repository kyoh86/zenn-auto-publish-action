# zenn.dev auto publish action

Make the "published" property "true" in the articles which have the past "publishAt" property

## Inputs

### `timezone`

The time zone to be applied to the date of the article with no time zone specified.

Default: 'Asia/Tokyo'

## Outputs

### `published`

If there are new published articles, `true`.

## Usage

```yaml
on:
  schedule:
    - cron: '1 * * * *'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source
        uses: actions/checkout@v2
      - name: Publish articles
        id: publish
        uses: kyoh86/zenn-auto-publish-action@v0.0.2
      - name: Push posts
        if: steps.publish.outputs.published == 'true'
        run: |
          git config user.email "${{ github.event_name }}@${{github.repository_owner}}"
          git config user.name "${{ github.event_name }}"
          git commit -am 'Publish'
          git push
```
