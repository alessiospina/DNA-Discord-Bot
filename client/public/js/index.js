/* eslint-disable prettier/prettier */
$(document).ready(function() {

    const confirmButtonCommandModal = $('#confirmButtonCreateCommandModal')
    const createCommandModal = $('#createCommandModal')
    const closeButtonCreateCommandModal = $('#closeButtonCreateCommandModal')
    const createButtonCommandModal = $('#createButtonCommandModal');
    const actionInputText = $('#actionInputText')
    const descriptionInputText = $('#descriptionInputText')
    const responseInputText = $('#responseInputText')
    const idInputText = $('#idInputText')
    const modifyCommandButton = $('.modifyCommandButton')
    const dataTable = $('#table').DataTable({searching: false, paging: false, info: false})

    createButtonCommandModal.click(function() {
        createCommandModal.modal('show')
    });

    closeButtonCreateCommandModal.click(function() {
        createCommandModal.modal('hide')
    });

    confirmButtonCommandModal.click(function() {
        const id = (idInputText.val() === null || idInputText.val() === NaN) ?  null : Number(idInputText.val())
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
            success: function(res) { 
                alert("Save Complete") 
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert("Error") 
            },
            complete: function() {
                console.log('completed')
                createCommandModal.modal('hide')
                location.reload(true)
            }
        });

    });


    modifyCommandButton.click(function() {
        const data = dataTable.row($(this).parents('tr')).data();
        const id = Number(data[1])
        const action = data[2]
        const description = data[3]
        const response = data[4]

        console.log(data)

        idInputText.val(id)
        actionInputText.val(action)
        descriptionInputText.val(description)
        responseInputText.val(response)

        createCommandModal.modal('show')
    });
});