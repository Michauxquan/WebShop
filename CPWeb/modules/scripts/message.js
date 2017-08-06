
//message_privatelist psge  class ='checkAll'
$(function() {
    $(".checkAll").click(function() {
        if ($(".checkAll").prop("checked") == true) {
            $(".checkAll,.check,.checkAll").prop("checked", true);
        } else {
            $(".checkAll,.check,.checkAll").prop("checked", false);
        }
    });
    $(".checkall").click(function() {
        if ($(".checkall").prop("checked") == true) {
            $(".checkall,.check,.checkall").prop("checked", true);
        } else {
            $(".checkall,.check,.checkall").prop("checked", false);
        }
    });
});
//account_safe
$(document).ready(function() {
    $(".po").click(function() {
        if ($(".mima").css("display") == 'none') {
            $(".mima").show(0, function() {
                $(".po .action .default").css("display", "block");
                $(".po .action .state-edit").css("display", "none");
            });
        } else {
            $(".mima").hide(0, function () {
                reset();
                $(".po .action .state-edit").css("display", "block");
                $(".po .action .default").css("display", "none");
            });
        }
    });

    $(".po1").click(function() {
        if ($(".shouji").css("display") == 'none') {
            $(".shouji").show(0, function() {
                $(".po1 .action .default").css("display", "block");
                $(".po1 .action .state-edit").css("display", "none");
            });
        } else {
            $(".shouji").hide(0, function () {
                reset();
                $(".po1 .state-edit").css("display", "block");
                $(".po1 .default").css("display", "none");
            });
        }
    });

    $(".po2").click(function() {
        if ($(".email").css("display") == 'none') {
            $(".email").show(0, function() {
                $(".po2 .action .default").css("display", "block");
                $(".po2 .action .state-edit").css("display", "none");
            });
        } else {
            $(".email").hide(0, function () {
                reset();
                $(".po2 .state-edit").css("display", "block");
                $(".po2 .default").css("display", "none");
            });
        }
    });

});
