var homeconfig = {
    pageSize: 20,
    pageIndex : 1,
}
var homeController = {
    init: function () {
        homeController.loadData();
        homeController.registerEvent();
       

    },
    registerEvent: function () {
        $('.txtSalary').off('keypress').on('keypress', function (e) {
            if (e.which == 13) // kiem tra bam nut enter
            {
                var id = $(this).data('id');
                var value = $(this).val();

                homeController.updateSalary(id, value);
            }
        });



        $('#btnAddnew').off('click').on('click',function(){
            $('#modalAddUpdate').modal('show');
            homeController.resetForm();
        });

        $('#btnSave').off('click').on('click',function(){
            homeController.saveData();
           
        });
    },

    resetForm : function(){  //  xóa tất cả control
        $('#hidID').val('0');
        $('#txtName').val('');
        $('txtSalary').val(0);
        $('#ckStatus').prop('checked', true);
    },

    saveData:function(){
        var name = $('#txtName').val();
        var salary = parseFloat($('#txtSalary').val());
        var status = $('#ckStatus').prop('checked');
        var id = parseInt($('#hidID').val());
        var  empl= {
            Name: name,
            Salary: salary,
            Status:status,
            ID:id
        }
        $.ajax({
            url: '/Home/SaveData',
            data: {
                strempl: JSON.stringify(empl)
            },
            type: 'POST',
            dataType: 'json',
            success: function (rp) {
                if (status == true) {
                    alert('Them thanh cong');
                    $('#modalAddUpdate').modal('hide');
                    homeController.loadData();
                }
                else {
                    alert(rp.Message);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },


    updateSalary:function(id,value){
        var data = {
            ID:id,
            Salary:value
        };
        $.ajax({
            url:'/Home/Update',
            type:'POST',
            dataType:'json',
            data:{model:JSON.stringify(data)},
                success:function(rp){
                if(rp.status)
                {
                    alert('update thanh cong')
                }else{
                    alert('update that bai');
                }
            }
        })
    },

    loadData: function () {
        $.ajax({
            url: '/Home/LoadData',
            type: 'GET',
            data:{// phân trang
                // page:1,
                page:homeconfig.pageIndex,
                pageSize:homeconfig.pageSize
            },
            dataType: 'json',
            success: function (rp) {
                if (rp.Status) {
                    var data = rp.data;

                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Salary: item.Salary,
                            Status: item.Status==true? "<span class=\"label label-success\">Kich Hoat</span>":"<span class=\"label label-danger\">Khoa</span>"
                        });
                    });
                    $('#tblData').html(html);
                    homeController.paging(rp.total, function () {  // phân trang
                        homeController.loadData();
                    });
                    homeController.registerEvent();
                }
            }
        })
    },

    // phân trang
    paging: function (totalRow, callback) {
        var totalPage = Math.ceil(totalRow / homeconfig.pageSize);

        $('#pagination').twbsPagination({
            totalPages: totalPage,
            first: "Đầu",
            next: "Tiếp",
            last: "Cuối",
            prev:"Trước",
            visiblePages: 10,
            onPageClick: function (event, page) {
                homeconfig.pageIndex=page,
                setTimeout(callback, 200);
            }
        });
    }
}
homeController.init();