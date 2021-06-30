function Table(idtable){
    $('#' + idtable).DataTable({
        dom: 'Bfrtip',
        "pageLength": 5,
        "searching":false,
        // "order": [
        //     [1, 'asc']
        // ],
        // buttons: [
        //     'copy', 'csv', 'excel', 'pdf', 'print'
        // ]
        buttons: [
            
        ],
    });
};
    
// tabel users
var idtable = "kesimpulan";
Table(idtable);