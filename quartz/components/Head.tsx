import { i18n } from "../i18n"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { CustomOgImageEmitterName } from "../plugins"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
    const title = fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
    const description =
      fileData.description ?? i18n(cfg.locale).propertyDefaults.description
    const { css, js } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug ? pathToRoot(fileData.slug) : pathToRoot("" as FullSlug)

    const iconPath = joinSegments(baseDir, "static/icon.png")
    const ogImagePath = joinSegments(baseDir, "static/og-image.png")

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImagePath} />
        <meta property="og:width" content="1200" />
        <meta property="og:height" content="675" />
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImagePath} />
        <link rel="icon" href={iconPath} />
        {css.map((href) => (
          <link key={href} rel="stylesheet" href={href} data-preserve="true" />
        ))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((resource) => {
            const component = resource.contentType === "inline" ? (
              <script key={resource.src} dangerouslySetInnerHTML={{ __html: resource.src }} />
            ) : (
              <script key={resource.src} src={resource.src} />
            )
            return component
          })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor