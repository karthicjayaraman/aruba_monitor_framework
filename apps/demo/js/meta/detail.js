ScreenMetaData = {
    view: 'detail',
    metainfo: {
        view: 'detail',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },

    panels: {
        row1: {
            attr: { class: 'row' },
            children: {
                column1: {
                    attr: { class: 'col-md-6' },
                    children: {
                        generalinfo: {
                            type: 'form',
                            children: {}
                        }
                    }
                },

                column2: {
                    attr: { class: 'col-md-6' },
                    children: {
                        additionalinfo: {
                            type: 'form',
                            children: {}
                        }
                    }
                }
            }
        }
    }
}