const files = import.meta.glob('/src/locales/files/*.md', {
    query: '?raw',
    import: 'default'
  })
  
const fileImport = async (props, locale) => {
  const lang = locale.value
  const filename = `/src/locales/files/${props.file}.${lang}.md`
  const importer = files[filename]

  if (importer) {
    return await importer()
  } else {
    return 'Content not available.'
  }
}

export default fileImport