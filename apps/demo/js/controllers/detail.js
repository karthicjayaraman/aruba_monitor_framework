function detailController($scope) {
    
    $scope.model = {
        generalinfo: {},
        additionalinfo: {}
    };
    
    $scope.submitGeneralForm = function () {

        console.log($scope.model.generalinfo);
    }

    //Overrride init
    this.$init = function () {
        console.log(this.$metaInfo);

        $scope.getScreenMeta(this.$metaInfo.view, function (metaData) {
            if (!metaData)
                return;

            $scope.schema = eval(metaData);

            var gen = $scope.schema.panels.row1.children.column1.children.generalinfo.children;
            var addinfo = $scope.schema.panels.row1.children.column2.children.additionalinfo.children;

            //Generate forms
            for (var i = 0; i < 100; i++) {
                gen['gen_field_' + i] = {
                    type: 'text',
                    label: 'General Info #' + i,
                    help: 'Legal name should be entered here',
                    cls: '',
                    lblcls: '',
                    helpcls: '',
                    name: 'gen_field_' + i
                };

                addinfo['add_field_' + i] = {
                    type: 'text',
                    label: 'Additional Info #' + i,
                    help: 'Legal name should be entered here',
                    cls: '',
                    lblcls: '',
                    helpcls: '',
                    name: 'add_field_' + i
                };

                $scope.model.generalinfo['gen_field_' + i] = 'Value #' + i;
                $scope.model.additionalinfo['add_field_' + i] = 'Value #' + i;
            }

            console.log($scope.model.generalinfo)

            gen['gen_field_99'].type = 'button';
            gen['gen_field_99'].label = 'Submit';
            gen['gen_field_99'].handle = 'submitGeneralForm';

            addinfo['add_field_99'].type = 'button';
            addinfo['add_field_99'].label = 'Submit';

            $scope.InitializeScreen($scope);
        });
    }

    this.$init($scope);
}

//minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
detailController.$inject = ['$scope'];