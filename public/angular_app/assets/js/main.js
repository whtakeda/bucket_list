$(document).ready(function() {
  $('#modal-delete').on('show.bs.modal', function(evt) {
    $(".modal-body").html('Delete activity?');
  });

  $('#confirm').on('click', function(e) {
    var id = $('#domId').attr('data-id');
    console.log("deleting list with id " + id)
    $.ajax({
      url:"/lists/" + id,
      headers: {
        'x-access-token' : localStorage.getItem('token')
      },
      method:'DELETE',
    }).done(function(data){
      $("div[data-id='" + data + "']").remove();
    });
  });

  $('#main').slideDown(1000);

});
