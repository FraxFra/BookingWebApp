var vm = new Vue({
    data: {
        materie: [],
        professori: [],
        selectedSubjects: [],
        selectedProfessors: [],
    },
    el: '#list',
    mounted (){
        this.loadSubjects();
        this.loadProfessors();
    },
    methods: {
        loadSubjects() {
            console.log(this.materie);
            $.ajax({
                url: "SlotServlet",
                data: {
                    operation: "subjectDDL"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.materie = result.data.map(name => {
                            return{
                                name:name.description
                            }
                        });
                    } else {
                        // vm.openError(result.error);
                    }
                }
            });
        },
        loadProfessors() {
            $.ajax({
                url: "SlotServlet",
                data: {
                    operation: "teacherDDL"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.professori = result.data.map(name => {
                            return{
                                name:name.description
                            }
                        });
                    } else {
                        // vm.openError(result.error);
                    }
                }
            });
        },
    }

});