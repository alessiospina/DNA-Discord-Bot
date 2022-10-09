/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
$(document).ready(function() {

    // buttons
    const confirmButtonCommandModal = $('#confirmButtonCreateCommandModal');
    const closeButtonCreateCommandModal = $('#closeButtonCreateCommandModal');
    const createButtonCommandModal = $('#createButtonCommandModal');
    const confirmButtonDeleteCommand = $('#confirmButtonDeleteCommand')
    const deleteButtonDeleteCommand = $('#deleteButtonDeleteCommand')

    //input text
    const actionInputText = $('#actionInputText');
    const descriptionInputText = $('#descriptionInputText');
    const responseInputText = $('#responseInputText');
    const idInputText = $('#idInputText');
    const idInputTextDeleteModal = $('#idInputTextDeleteModal')

    // modals
    const createCommandModal = $('#createCommandModal');
    const deleteCommandModal = $('#deleteCommandModal');

    // p
    const pCommandToDelete = $('#pCommandToDelete');

    // data
    const dataCommands = $('#dataCommands');

    

    const dataTable = $('#table').DataTable({
            searching: true, 
            paging: true, 
            info: false,
            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return '' +
                            '<div class="dropdown">' +
                                '<button type="button" class="btn btn-outline-primary dropdown-toggle" id="dropdownMenuIconButton8" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                    '<i class="mdi mdi-pencil"></i>' +
                                '</button>' +
                                '<div class="dropdown-menu" aria-labelledby="dropdownMenuIconButton8" style="">' +
                                    '<a class="dropdown-item modifyCommandButton">Modify</a>' +
                                    '<a class="dropdown-item deleteCommandButton">Delete</a>' +
                                '</div>' +
                            '</div>'; 
                    }
                },
                {
                    targets: 1,
                    orderable: false,
                    visible: false,
                    searchable: false,
                },
                {
                    targets: 2,
                    orderable: false,
                    searchable: true,
                },
                {
                    targets: 3,
                    orderable: false,
                    searchable: true,
                },
                {
                    targets: 4,
                    orderable: false,
                    searchable: true,
                },
                {
                    targets: 5,
                    orderable: false,
                    searchable: false,
                    visible: false,
                },
                {
                    targets: 6,
                    orderable: true,
                    searchable: true,
                }
            ],
            order:[[6, 'desc']],
            data: JSON.parse(dataCommands.html()),
            columns: [
                { "data": "" },
                { "data": "id" },
                { "data": 'action' },
                { "data": 'description' },
                { "data": 'response' },
                { "data": 'createdAt' },
                { "data": 'updatedAt' }
            ]
        }
    );

    createButtonCommandModal.click(function() {
        actionInputText.val("")
        descriptionInputText.val("")
        responseInputText.val("")
        createCommandModal.modal('show')
    });

    closeButtonCreateCommandModal.click(function() {
        createCommandModal.modal('hide')
    });

    confirmButtonCommandModal.click(function() {
        const id = (idInputText.val() === null || isNaN(idInputText.val())) ?  null : Number(idInputText.val())
        const action = actionInputText.val()
        const description = descriptionInputText.val()
        const response = responseInputText.val()

        console.log('id:' + id)

        const command = {
            id: id,
            action: action,
            description: description,
            response: response
        }

        console.log(command)

        $.ajax({
            type: 'POST',
            url: "/dashboard/create/command",
            data: JSON.stringify(command),
            contentType: "application/json",
            success: function(res) {},
            error: function(jqXHR, textStatus, errorThrown){
                alert("Insert command error, sorry :(") 
            },
            complete: function() {
                createCommandModal.modal('hide')
                location.reload(true)
            }
        });

    });

    $(document).on('click', '.modifyCommandButton', function(){
        const data = dataTable.row($(this).parents('tr')).data();
        console.log(data)

        idInputText.val(data.id)
        actionInputText.val(data.action)
        descriptionInputText.val(data.description)
        responseInputText.val(data.response)

        createCommandModal.modal('show')
    });

    $(document).on('click', '.deleteCommandButton', function(){
        const data = dataTable.row($(this).parents('tr')).data();
        console.log(data)
        pCommandToDelete.text('Are you sure that you want delete the action: ' + data.action)
        idInputTextDeleteModal.val(data.id)
        deleteCommandModal.modal('show')
    });


    confirmButtonDeleteCommand.click(function(){

        console.log(idInputTextDeleteModal.val())
        
        const command = {
            id: idInputTextDeleteModal.val()
        }

        $.ajax({
            type: 'DELETE',
            url: "/dashboard/delete/command",
            data: JSON.stringify(command),
            contentType: "application/json",
            success: function(res) {},
            error: function(jqXHR, textStatus, errorThrown){
                alert("Delete command error, sorry :(") 
            },
            complete: function() {
                deleteCommandModal.modal('hide')
                location.reload(true)
            }
        });
    })

    deleteButtonDeleteCommand.click(function(){
        deleteCommandModal.modal('hide')
    })
});