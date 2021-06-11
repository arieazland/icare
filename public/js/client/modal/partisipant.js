$(document).ready(function(){
    //tampilkan modal users hapus record
    $('#listKonsul').on('click','.delete',function(){
        var id = $(this).data('id');
        var nama = $(this).data('nama');
        $('#modalHapuskonsul').modal('show');
        $('.modalidkonsulhapus').val(id);
        $('.judul').text(nama);
    });
});