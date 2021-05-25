function loadContacts() {
	clearContactTable();
	var contentRows = $("#contentRows");

	$.ajax({
		type: 'GET',
		url: 'https://tsg-contactlist.herokuapp.com/contacts',
		success: function(contactArray) {
			$.each(contactArray, function(index, contact) {
				let name = contact.firstName + ' ' + contact.lastName;
				let company = contact.company;
				let contactId = contact.contactId;
				
				let row = '<tr>';
					row += '<td>' + name + '</td>';
					row += '<td>' + company + '</td>';
					row += '<td><button type="button" class="btn btn-info">Edit</button></td>';
					row += '<td><button type="button" class="btn btn-danger">Delete</button></td>';
					row += '</tr>';
				
				jQRow = $(row)
				jQRow.find("button").on("click", function() {
					if ($(this).hasClass("btn-info")) {
						showEditForm(contactId);
					} else if ($(this).hasClass("btn-danger")) {
						deleteContact(contactId);
					}
				});
				
				contentRows.append(jQRow);
            });
		},
		error: function() {
			$('#errorMessages')
				.append($('<li>')
				.attr({class: 'list-group-item list-group-item-danger'})
				.text('Error calling web service. Please try again later.'));
		}
	});
}

function addContact() {
	$('#addButton').click(function (event) {

		var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('input'));
        
        if(haveValidationErrors) {
            return false;
        }

		$.ajax({
			type: 'POST',
			url: 'https://tsg-contactlist.herokuapp.com/contact',
			data: JSON.stringify({
				firstName: $('#addFirstName').val(),
				lastName: $('#addLastName').val(),
				company: $('#addCompany').val(),
				phone: $('#addPhone').val(),
				email: $('#addEmail').val()
			}),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			'dataType': 'json',
			success: function() {
				$('#errorMessages').empty();
				$('#addFirstName').val('');
				$('#addLastName').val('');
				$('#addCompany').val('');
				$('#addPhone').val('');
				$('#addEmail').val('');
				loadContacts();
			},
			error: function () {
				$('#errorMessages')
					.append($('<li>')
					.attr({class: 'list-group-item list-group-item-danger'})
					.text('Error calling web service. Please try again later.')); 
			}
		});
	});	
}

function updateContact() {
	$("#editCancelButton").on("click", function() {hideEditForm();});
	$("#updateButton").on("click", function() {
		var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));
        
        if(haveValidationErrors) {
            return false;
        }

		$.ajax({
			type: 'PUT',
			url: 'https://tsg-contactlist.herokuapp.com/contact/' 
					+ $('#editContactId').val(),
			data: JSON.stringify({
				contactId: $("#editContactId").val(),
				firstName: $('#editFirstName').val(),
                lastName: $('#editLastName').val(),
                company: $('#editCompany').val(),
                phone: $('#editPhone').val(),
                email: $('#editEmail').val()
			}),
			headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            'success': function() {
                $('#errorMessage').empty();
                hideEditForm();
                loadContacts();
            },
            'error': function() {
				$('#errorMessages')
					.append($('<li>')
					.attr({class: 'list-group-item list-group-item-danger'})
					.text('Error calling web service. Please try again later.')); 
			}
		});
	});
}

function clearContactTable() {
	$("#contentRows").empty();
}

function deleteContact(contactId) {
	if (confirm("Delete Contact?")) {
		$.ajax({
			type: 'DELETE',
			url: 'https://tsg-contactlist.herokuapp.com/contact/'
					+ contactId,
			success: function() {
				loadContacts();
			}
		});
	}
}

function showEditForm(contactId) {
	$("#errorMessages").empty();

	$.ajax({
		type: 'GET',
		url: 'https://tsg-contactlist.herokuapp.com/contact/' + contactId,
		success: function(data, status) {
			$('#editFirstName').val(data.firstName);
            $('#editLastName').val(data.lastName);
            $('#editCompany').val(data.company);
            $('#editPhone').val(data.phone);
            $('#editEmail').val(data.email);
            $('#editContactId').val(data.contactId);
		},
		error: function() {
            $('#errorMessages')
            .append($('<li>')
            .attr({class: 'list-group-item list-group-item-danger'})
            .text('Error calling web service. Please try again later.')); 
        }
	});
	$("#contactTable").hide();
	$("#editFormDiv").show();
}

function hideEditForm() {
	$("#errorMessages").empty();

	$("#editFirstName").val('');
	$("#editLastName").val('');
	$("#editCompany").val('');
	$("#editPhone").val('');
	$("#editEmail").val('');

	$("#contactTable").show();
	$("#editFormDiv").hide();
}

function checkAndDisplayValidationErrors(input) {
	$('#errorMessages').empty();
	var errorMessages = [];

	input.each(function() {
		if (!this.validity.valid) {
			var errorField = $('label[for=' + this.id + ']').text();
			errorMessages.push(errorField + ' ' + this.validationMessage);
		}
	});

	if (errorMessages.length > 0){
        $.each(errorMessages,function(index,message) {
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}

$(document).ready(function () {
	loadContacts();
	addContact();
	updateContact();
});