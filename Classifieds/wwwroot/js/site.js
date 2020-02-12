﻿/* Set the width of the side navigation to 250px */
function OpenSidebar() {
    document.getElementById("sideNavigation").style.width = "300px";
}

/* Set the width of the side navigation to 0 */
function CloseSidebar() {
    document.getElementById("sideNavigation").style.width = "0";
}
function UploadImageDialog() {

    var url = "/Classifieds/Upload";

    $("#upload-image-modal").remove();


    GetPartialView(url, function (data) {
        $(data).modal();
    });
     
}
function DeleteLike(id) {

        $.ajax({
            url: '/User/DeleteLike/' + id,
            type: 'get',
            dataType: 'json'

        }).done(function (data, textStatus, jqXHR) {

            if (data === false) {
                alert('Sorry there was an error');
            }
            window.location.reload();
        })
            .fail(function (jqXHR, errorText, errorThrown) {
                alert('Sorry there was an error');
                window.location.reload();
            });

}
/**
 * Delete a category
 * @param {id} catId category id
 * @param {boolean} parent is it parent menu?
 * 
 */
function DeleteCategory(catId, parent) {

    var result = false;

    if (parent) {
        result = confirm('This will delete this category and all sub-categories!');
    }
    else {
        result = confirm('Are you sure you want to delete?');
    }

    if (result) {
        $.ajax({
            url: '/Category/Delete/' + catId,
            type: 'get',
            dataType: 'json'

        }).done(function (data, textStatus, jqXHR) {
            alert(data);
            window.location.reload();
        })
            .fail(function (jqXHR, errorText, errorThrown) {
                alert('Sorry there was an error');
                window.location.reload();
            });


    }

}
function LikeAd(element, id) {
    var checked = element.checked;

    $.ajax({
        url: '/User/Like/',
        type: 'get',
        dataType: 'json',
        data: { id: id, like: checked }
    }).done(function (data, textStatus, jqXHR) {
        //alert(data);
        //window.location.reload();
    })
    .fail(function (jqXHR, errorText, errorThrown) {
        //alert('Sorry there was an error');
        //window.location.reload();
    });


}

function DeleteMenu(menuId, parent) {

    var result = false;

    if (parent) {
        result = confirm('This will delete this menu and all sub-menus!');
    }
    else {
        result = confirm('Are you sure you want to delete?');
    }

    if (result) {
        $.ajax({
            url: '/Menu/Delete/' + menuId,
            type: 'get',
            dataType: 'json'

        }).done(function (data, textStatus, jqXHR) {
            alert(data);
            window.location.reload();
        })
            .fail(function (jqXHR, errorText, errorThrown) {
                alert('Sorry there was an error');
                window.location.reload();
            });


    }

}
function DeleteUser(userId) {
    var result = confirm("Are you sure?");

    if (result) {
        $.ajax({
            url: '/User/Delete/' + userId,
            type: 'get',
            dataType: 'json'

        }).done(function (data, textStatus, jqXHR) {
            alert(data);
            window.location.reload();
        })
        .fail(function (jqXHR, errorText, errorThrown){
            alert('Sorry there was an error');
            window.location.reload();
         });

        
    }
    
}
function UpdateStatus(id, controller, checkbox) {
    var url = '/' + controller + '/Status/';
    $.ajax({
        url: url,
        type: 'get',
        data: { id: id, approved: checkbox.checked}
    }).done(function (data, textStatus, jqXHR) {
        alert(data);
        window.location.reload(); 
    })
    .fail(function (jqXHR, errorText, errorThrown) {
        alert("Failed to submit. Internal error.");
        window.location.reload();
    });
   
}
function UpdateAdmin(id, controller, checkbox) {

    var url = '/' + controller + '/Admin/';
    $.ajax({
        url: url,
        type: 'get',
        data: { id: id, isAdmin: checkbox.checked }
    }).done(function (data, textStatus, jqXHR) {
        alert(data);
        window.location.reload(); 
    })
        .fail(function (jqXHR, errorText, errorThrown) {
            alert("Failed to submit. Internal error.");
            window.location.reload();
        });

}
function ModalDismiss(modalId) {
    var modal = "#" + modalId;

    $(modal).remove();
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}
function OnCategoryChanged(elementId) {
    var element = document.getElementById(elementId);
    var id = element.value;

    document.getElementById("ParentID").value = id;
    document.getElementById("CategoryID").value = 0;
    console.log("ParentID: " + id);

    var url = "/Category/SubCategories/";
    GetSubCategories(id, url, function (data) {
        console.log(data);

        $("#subcategory").empty();
        $("#subcategory").append("<option value= 0>Select Sub-Category</option>");

        for (var i = 0; i < data.length; i++) {
            $("#subcategory").append("<option value='"
                + data[i].id + "'>" + data[i].name + "</option>");
        }
    });

    
}

function OnSubCategoryChanged(elementId) {
    var id = document.getElementById(elementId).value;
    document.getElementById("CategoryID").value = id;
    console.log("CategoryID: " + id);
}
/**
 * Edit advert modal
 * @param {id} id advert id
 */
function EditAdvert(id) {

    var url = "/Classifieds/Edit/" + id;

    GetPartialView(url, function (data) {
        $(data).modal().on('shown.bs.modal', function () {

            //-------------------------------------Upload Pictures--------------------------
            var multiWidget = uploadcare.MultipleWidget('#Detail_UcareWidget');

            multiWidget.onUploadComplete(function (group) {
                if (group) {
                    group;

                    document.getElementById("Detail_GroupCdn").value = group.cdnUrl;
                    document.getElementById("Detail_GroupCount").value = group.count;
                    document.getElementById("Detail_GroupSize").value = group.size;
                    document.getElementById("Detail_GroupUuid").value = group.uuid;

                }
            });
            //Get information for individual files
            multiWidget.onChange(function (group) {
                var count = 0;
                var html = "";
                $("#pictures").empty();

                if (group) {
                    group.files().forEach(function (file) {
                        file.done(function (info) {
                            console.log(info); // fileInfo object
                            html += "<input type='hidden' id='Detail_AdPictures' name=Detail.AdPictures[" + count + "].Uuid " +
                                "value = '" + info.uuid + "' />";
                            html += "<input type='hidden' id='Detail_AdPictures' name=Detail.AdPictures[" + count + "].CdnUrl " +
                                "value = '" + info.cdnUrl + "' />";
                            html += "<input type='hidden' id='Detail_AdPictures' name=Detail.AdPictures[" + count + "].Name " +
                                "value = '" + info.name + "' />";
                            html += "<input type='hidden' id='Detail_AdPictures' name=Detail.AdPictures[" + count + "].Size " +
                                "value = '" + info.size + "' />";

                            count++;
                        });
                    });
                    $("#pictures").append(html);
                }
                else {

                    document.getElementById("Detail_GroupCdn").value = "";
                    document.getElementById("Detail_GroupCount").value = 0;
                    document.getElementById("Detail_GroupSize").value = "";
                    document.getElementById("Detail_GroupUuid").value = "";
                }
            });
        });
    });

}

function GetMenuUrl(elementId) {
    var element = document.getElementById(elementId);
    var string = element.value;
    if (string !== null || string !== "") {
        var url = "/Admin/" + string.charAt(0).toUpperCase() + string.slice(1);
        url = url.replace(/\s+/g, '');
        $("#Url").attr("value", url);
    }
}
function GetCategoryUrl(elementId) {
    var element = document.getElementById(elementId);
    var string = element.value;
    if (string !== null || string !== "") {
        var url = "/Admin/" + string.charAt(0).toUpperCase() + string.slice(1);
        url = url.replace(/\s+/g, '');
        $("#Url").attr("value", url);
    }
}
function SubmitForm(formId) {
    var formToSubmit = document.getElementById(formId);
    var url = $(formToSubmit).attr('action');
    var formData = $(formToSubmit).serializeArray();

    $.ajax({
        url: url,
        data: formData,
        type:"post"
    })
        .done(function (data, textStatus, jqXHR) {
            $('.modal').remove();
        if (jqXHR.status === 200) {
        $(data).modal();
    }
    if (jqXHR.status === 201) {
        alert(data);
        window.location.reload();
    }
    })
    .fail(function (jqXHR, errorText, errorThrown) {
        alert("Failed to submit. Internal error.");
    });
}
function GetPartialView(url, callback) {
    $.ajax({
        url: url,
        type: "get",
        dataType: "HTML"
    })
        .done(function (data, textStatus, jqXHR) {
            callback(data);
        })
        .fail(function (jqXHR, errorText, errorThrown) {
            alert("Failed to fetch view");
        });
}
function GetSubCategories(categoryId,url, callback) {
    $.ajax({
        url: url,
        type: "get",
        data: {id: categoryId},
        dataType: "json"
    }).done(function (data, textStatus, jqXHR) {
        callback(data.results);
    }).fail(function (jqXHR, errorText, errorThrown) {
        alert("Failed to load sub-categories!");
    });
}
function ReadURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInp").change(function () {
    ReadURL(this);
});
function LocalUploadOnChange() {
    var preview = document.getElementById("preview");
    var fileInput = document.getElementById("local-upload");

    for (var i = 0; i < fileInput.files.length; i++) {

        // Add img element in <div id='preview'>
        var reader = new FileReader();
        reader.onload = function (e) {
            var listItem = document.createElement("li");

            listItem.innerHTML =
                '<div class="file-container w-100 d-flex flex-row align-items-center mb-3">' +
                    '<div class="w-20 h-100 thumb pl-2"><img src="' + e.target.result + '"/></div>' +
                    '<div class="progress w-70" ><div class="progress-bar w-75"' +
                        'role="progressbar" aria-valuenow="75" aria-valuemin="0"' +
                        'aria-valuemax="100" ></div></div>' +
                    '<div class="w-10"><button type="button"' +
                        'class= "close" data-dismiss="modal" aria-label="close"' +
                        'onclick = "ModalDismiss("advert-detail-modal")" >' +
                '<span aria-hidden="true">&times;</span></button ></div>' +
            '</div> ';
            
            preview.append(listItem);
        };

        reader.readAsDataURL(fileInput.files[i]);
       
        
    }
}

$(document).ready(function () {
    $(document).on('hidden.bs.modal', '.modal', function () {
        $(".modal-dialog").remove();
    });


    $("#category").on("change", function () {
        var id = $(this).val();
        var url = "/Category/SubCategories/";
        GetSubCategories(id, url, function (data) {
            console.log(data); 

            $("#subcategory").empty();
            $("#subcategory").append("<option value= 0>Select Sub-Category</option>");

            for (var i = 0; i < data.length; i++) {
                $("#subcategory").append("<option value='"
                    + data[i].id + "'>" + data[i].name + "</option>");
            }
        });
    });

    $("#subcategory").on("change", function () {
        var id = $(this).val();
        document.getElementById("CategoryID").value = id;
        
    });

    $("#category").on("change", function () {
        document.getElementById("ParentID").value = $(this).val();
        document.getElementById("CategoryID").value = 0;
        console.log($(this).val());
    });
    //================================Partial View Modals============================
    $(".modal-link").on("click", function (e) {
        e.preventDefault();

        $("#advert-detail-modal").remove();

        var url = $(this).attr("href");

        GetPartialView(url, function (data) {
            $(data).modal();
        });
        
    });
    $("#edit-address").on("click", function (e) {
        e.preventDefault();

        $("#address-form").remove();

        var url = $(this).attr("href");

        GetPartialView(url, function (data) {
            $(data).modal();
        });
    });
    $("#add-menu").on("click", function (e) {
        e.preventDefault();

        var url = "/Menu/Create";

        GetPartialView(url, function (data) {
            $(data).modal();
        });
    });
    $("#add-category").on("click", function (e) {
        e.preventDefault();

        var url = "/Category/Create";

        GetPartialView(url, function (data) {
            $(data).modal();
        });
    });
    $(".edit-link ").on("click", function (e) {
        e.preventDefault();

        var url = this.href;

        GetPartialView(url, function (data) {
            $(data).modal();
        });
    });
    $(".userDetailLink").on("click", function (e) {
        e.preventDefault();

        

        var url = $(this).attr("href");

        GetPartialView(url, function (data) {
            $(data).modal();
        });
    });
    //===================================UPLOADCARE WIDGET=================================
    if ($("#create-ad").is(":visible")) {
        var multiWidget = uploadcare.MultipleWidget('#uploadcareWidget');

        multiWidget.onUploadComplete(function (group) {
            if (group) {
                group;

                document.getElementById("Detail_GroupCdn").value = group.cdnUrl;
                document.getElementById("Detail_GroupCount").value = group.count;
                document.getElementById("Detail_GroupSize").value = group.size;
                document.getElementById("Detail_GroupUuid").value = group.uuid;

            }
        });
        //Get information for individual files
        multiWidget.onChange(function(group) {
            if (group) {
                $.when.apply(null, group.files()).then(

                    function () {
                        var filesInfo = arguments;
                        var html = "";

                        for (i = 0; i < filesInfo.length; i++) {
                            html += "<input type='hidden' id='Detail_AdPictures' name=Detail.AdPictures[" + i + "].Uuid " + 
                                "value = '" + filesInfo[i].uuid + "' />";
                            html += "<input type='hidden' id='Detail_AdPictures' name=Detail.AdPictures[" + i + "].CdnUrl " +
                                "value = '" + filesInfo[i].cdnUrl + "' />";
                            html += "<input type='hidden' id='Detail_AdPictures' name=Detail.AdPictures[" + i + "].Name " +
                                "value = '" + filesInfo[i].name + "' />";
                            html += "<input type='hidden' id='Detail_AdPictures' name=Detail.AdPictures[" + i + "].Size " +
                                "value = '" + filesInfo[i].size + "' />";

                        }
                        $("#pictures").append(html);
                   }
                );

            }
        });

    }
    
    //=======================================ACCORDION ACTIVE============================
    $(".acc-nav-link").each(function () {
        
        var url = window.location.href;


        if (url === this.href) {
            //remove previous classes
            $(".accordion li").removeClass("active");
            $(".accordion .acc-heading").removeClass("active");
            $(".accordion .acc-heading .acc-link").removeClass("active");
            $(".accordion h6 a").attr("aria-expanded", "false");
            $(".accordion div").removeClass("show");
            //arrow icon
            var image = $(this).closest(".arrow-icon");
            image.src = "arrow-right.png";

            //add new classes
            $(this).addClass("active");
            $(this).closest("li").addClass("active");
            $(this).closest(".acc-heading").addClass("active");
            $(".accordion .acc-heading .acc-link").addClass("active");
            $(this).closest("h6 a").attr("aria-expanded", "true");
            //arrow icon
            image.src = "arrow-down.png";

            var divId = $(this).closest("div").attr("id");
            var div = document.getElementById(divId);
            $("#" + divId).addClass("show");
        }
        
    });
   //=============================================================
   
    $('.counter-count').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
                duration: 5000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
    });

    $('.like-button').click(function () {
        $(this).toggleClass('is-active');
    });
   //======================================Image Upload==================================
    $('input[name=files]').change(function (e) { 
        for (var index = 0; index < files.length; index++) {
            var src = files[index];

            // Add img element in <div id='preview'>
            $('#preview').append('<div class=""><img src="' + src + '" width="200px;" height="200px"></div>');
        }
    });

    
});