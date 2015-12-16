$(document).ready(function() {
  $('#modal-delete').on('show.bs.modal', function(evt) {
    // spotId = $(evt.relatedTarget).data('id');
    // spotTitle = $(evt.relatedTarget).data('title');
    $(".modal-body").html('Delete list?');
  });

  $('#confirm').on('click', function(e) {
    var id = $('#domId').attr('data-id');
    $.ajax({
      url:"/lists/" + id,
      method:'DELETE',
    }).done(function(data){
//      debugger;
      $("div[data-id='" + data + "']").remove();
    });
  });
});
