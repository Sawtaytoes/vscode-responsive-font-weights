import debounce from 'just-debounce'
import vscode, { ConfigurationTarget } from 'vscode'

export const activate = (
  context: (
    vscode
    .ExtensionContext
  )
) => {
  const getFontSize: () => (
    number
  ) = () => (
    vscode
    .workspace
    .getConfiguration(
      'editor'
    )
    .get(
      'fontSize'
    )
    ?? 0
  )

  let fontSize = (
    getFontSize()
  )

  const setFontFamily = () => {
    const editorConfig = (
      vscode
      .workspace
      .getConfiguration(
        'editor'
      )
    )

    const responsiveFontsConfig = (
      vscode
      .workspace
      .getConfiguration(
        'responseiveFonts'
      )
    )

    const {
      defaultFontWeight,
      sizeName,
    } = (
      [
        {
          defaultFontSize: 19,
          defaultFontWeight: 300,
          sizeName: 'Large',
        },
        {
          defaultFontSize: 11,
          defaultFontWeight: 500,
          sizeName: 'Medium',
        },
        {
          defaultFontSize: 0,
          defaultFontWeight: 700,
          sizeName: 'Small',
        },
      ]
      .find(({
        defaultFontSize,
        sizeName,
      }) => (
        fontSize
        >= (
          responsiveFontsConfig
          .get(
            `fontSize${sizeName}Up`
          ) as number
          ?? defaultFontSize
        )
      ))
      || {}
    )

    editorConfig
    .update(
      'fontWeight',
      (
        responsiveFontsConfig
        .get(
          `fontWeight${sizeName}`
        )
        ?? defaultFontWeight
      ),
      (
        ConfigurationTarget
        .Global
      ),
    )
    // @ts-expect-error
    .catch(
      console
      .error
    )
  }

  context
  .subscriptions
  .push(
    vscode
    .commands
    .registerTextEditorCommand(
      'responsiveFonts.fontZoomIn',
      () => {
        vscode
        .commands
        .executeCommand(
          'editor.action.fontZoomIn'
        )

        fontSize += 1

        setFontFamily()
      }
    )
  )

  context
  .subscriptions
  .push(
    vscode
    .commands
    .registerTextEditorCommand(
      'responsiveFonts.fontZoomOut',
      () => {
        vscode
        .commands
        .executeCommand(
          'editor.action.fontZoomOut'
        )

        fontSize -= 1

        setFontFamily()
      }
    )
  )

  context
  .subscriptions
  .push(
    vscode
    .commands
    .registerTextEditorCommand(
      'responsiveFonts.fontZoomReset',
      () => {
        vscode
        .commands
        .executeCommand(
          'editor.action.fontZoomReset'
        )

        fontSize = (
          getFontSize()
        )

        setFontFamily()
      }
    )
  )
}

export const deactivate = () => {}
