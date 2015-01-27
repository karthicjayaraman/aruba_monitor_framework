ScreenMetaData = {
    view: 'dashboard_1',
    metainfo: {
        view: 'dashboard_1',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },
    actions: {
        task_showTable: {
            type: 'post',
            url: 'http://10.29.23.19:9200/_all/_search?pretty',
            onBefore: function (scope, ops) {
                ops.data = {"size":20,"query":{"filtered":{"filter":{"bool":{"must":[{"term":{"SourceType":"arubastation"}}],"must_not":[],"should":[]}}}},"fields":["uname","role","devtype"]};
                scope.arrFields = ops.data.fields;
                return true;
            },
            onComplete: function (scope, data) 
            {
                console.log("Processing the Dynamic Table starts");
                scope.model.arrTableData = [];

                var tempArray1 = data.hits.hits;
                var tempArrayForTableData = [];
                for(var i=0;i<tempArray1.length;i++)
                {
                  var a = tempArray1[i];
                  var b = a.fields;
                  var arrayForKeys = scope.arrFields;
                  var tempDic = {};
                  for(var j=0;j<arrayForKeys.length;j++)
                  {
                    var key = arrayForKeys[j];
                    var value = "";
                    if(b[key])  
                     value = b[key][0];
                    tempDic[key] = value;
                  }
                  tempArrayForTableData.push(tempDic);
                }
                scope.model.arrTableData = tempArrayForTableData;
            }
        }
    },
    panels: {
        row1: {
            children: {
                grid: {
                    type:'gridpanel',
                    template: 'ui-grid',
                    model: 'arrTableData',
                    config: {
                        data:'model.arrTableData',
                    },
                    afterRender: function (scope, meta, parentEl, confg, options) {
                        scope.$doPefromAction(null, (meta.name || meta.id), scope, 'task_showTable');
                    }
                }                
            }
        }
    }
}



/*
The Request parameter for the Field Filter :

{"size":20,"query":{"filtered":{"filter":{"bool":{"must":[{"term":{"SourceType":"arubastation"}}],"must_not":[{"term":{"op":"delete"}}],"should":[]}}}},"aggs":{"0":{"terms":{"field":"role"}}},"fields":["uname","role","devtype"]}

*/