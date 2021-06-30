$(document).ready(function(){
    //tampilkan data ke modal users untuk edit
    $('#kesimpulan').on('click','.edit',function(){
        var id = $(this).data('id');
        var kesimpulan = $(this).data('kesimpulan');
        var idkonsul = $(this).data('idkonsul');
        var idpsikolog = $(this).data('idpsikolog');
        var idpeserta = $(this).data('idpeserta');
        $('#modalEditkesimpulan').modal('show');
        $('.modalidkesimpulan').val(id);
        $('.modalkesimpulan').val(kesimpulan);
        $('.modalidkonsulkesimpulan').val(idkonsul);       
        $('.modalidpesertakesimpulan').val(idpeserta);
    });
    //tampilkan modal users hapus record
    $('#kesimpulan').on('click','.delete',function(){
        var id = $(this).data('id');
        var kesimpulan = $(this).data('kesimpulan');
        var idkonsul = $(this).data('idkonsul');
        var idpsikolog = $(this).data('idpsikolog');
        var idpeserta = $(this).data('idpeserta');
        $('#modalHapuskesimpulan').modal('show');
        $('.modalidkesimpulanhapus').val(id);
        $('.modalidkonsulkesimpulan').val(idkonsul);       
        $('.modalidpesertakesimpulan').val(idpeserta);
        $('.judul').text(kesimpulan);
    });
});