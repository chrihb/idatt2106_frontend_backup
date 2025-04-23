const fileImport = async (props, locale) => {

    const lang = locale.value
    try {
        const imported = await import(`@/locales/files/${props.file}.${lang}.txt?raw`)
        return imported.default
    } catch (err) {
        console.error(`@/locales/files/${props.file}.${lang}.txt?raw`, err)
    }
}

export default fileImport