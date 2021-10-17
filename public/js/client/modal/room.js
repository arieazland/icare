$(document).ready(function(){
    //tampilkan data ke modal users untuk edit
    // $('#listUsers').on('click','.edit',function(){
    //     var id = $(this).data('id');
    //     var nama = $(this).data('nama');
    //     var email = $(this).data('email');
    //     $('#modalEditusers').modal('show');
    //     $('.modalid').val(id);
    //     $('.modalnama').val(nama);
    //     $('.modalemail').val(email);
    // });
    //tampilkan modal users hapus record
    $('#listVidcall').on('click','.delete',function(){
        var id = $(this).data('id');
        var nama = $(this).data('nama');
        $('#modalHapusroom').modal('show');
        $('.modalidhapus').val(id);
        $('.modalnamahapus').val(nama);
        $('.judul').text(nama);
    });
});