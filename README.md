# zenn.dev auto publish action

Make the "published" property "true" in the articles which have the past "publishAt" property

## Inputs

### `timezone`

The time zone to be applied to the date of the article with no time zone specified.

Default: 'Asia/Tokyo'

## Usage

```yaml
  - uses: 'kyoh86/zenn-auto-publish-action@v1'
    with:
      timezone: 'Asia/Tokyo'
```
