$(document).ready(function() {
    $("#related-article-0").attr("id", "featured-article-0");
    $("#related-article-1").attr("id", "featured-article-1")
    var i = 0;
    while ($('#featured-article-' + i).length > 0 && $('#featured-article-body-' + i).length > 0) {
        $('#featured-article-' + i).clone().appendTo('#featured-article-body-' + i);
        $('.article-section #featured-article-' + i).remove();
        i++;
    }

    $('.wb-entry-list section').each(function() {
        if ($('.img-banner-main-div .wb-content').data('id') == $(this).data('id')) {
            $(this).css('display', 'none')
        }
    });

    $('#ancViewMore').click(function() {
        $('.wb-entry-list section').each(function() {
            if ($('.img-banner-main-div .wb-content').data('id') == $(this).data('id')) {
                $(this).css('display', 'none')
            }
        });
    });
    $('.wb-category-title').text($('.img-banner-main-div h2').text());
    $('.wb-category-title').append('<i class="fa fa-angle-down"\>\</i><i class="fa fa-angle-up"></i>');
});