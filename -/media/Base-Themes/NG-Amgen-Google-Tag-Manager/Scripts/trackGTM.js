var trackGTM={Constants:{classMenuTrack:".trk-menu-link",classShareTrack:".trk-share-link",classQuizModuleTrack:".trk-quiz-module",classCtaTrack:".trk-cta-link",classNoGTMTrack:"trk-ignore",valMenuEventValue:"e_menuNav",valShareEventValue:"e_share",valQuizAnswerEventValue:"e_quizAnswer",valQuizLearnmoreEventValue:"e_quizLearnMore",trkMenuActionTier:"data-trk-menu-tier",trkMenuType:"data-trk-menu-type",trkMenuValue:"data-trk-menu-val",trkMenuValueOverride:"data-trk-menu-val-override",trkShareType:"data-trk-share-type",trkQuizNameValue:"data-trk-quiz-name",trkQuizNameValueOverride:"data-trk-quiz-name-override",trkQuizActionTier:"data-trk-quiz-actiontier",trkQuizType:"data-trk-quiz-button-type",trkInnerLnkText:"data-click-text",trkInnerLnkActionTier:"data-action-tier"},init:function(){"undefined"!=typeof dataLayer&&(trackGTM.menu.init(),trackGTM.page.init(),trackGTM.share.init(),trackGTM.quiz.init(),trackGTM.print.init())},print:{init:function(){void 0!==$("#printIcon")&&("undefined"!=typeof _printActionTier?$("#printIcon").attr("data-action-tier",_printActionTier):"undefined"!=typeof _shareActionTier&&$("#printIcon").attr("data-action-tier",_shareActionTier))}},page:{init:function(){"function"==typeof trackGTM.page.pushcode&&trackGTM.page.pushcode()}},inner:{init:function(){this.load(),this.itemclick()},load:function(){},itemclick:function(){$(trackGTM.Constants.classInnerLnkTrack).click(function(){if(!$(this).hasClass(trackGTM.Constants.classNoGTMTrack)&&!$(this).parent().hasClass(trackGTM.Constants.classNoGTMTrack)){var t=$(this).attr(trackGTM.Constants.trkInnerLnkText);void 0!==t&&t.length>0&&dataLayer.push({menuName:menuNameValue,menuType:_trkMenuType})}})}},menu:{init:function(){this.load(),this.itemclick()},load:function(){try{$(trackGTM.Constants.classCtaTrack).each(function(){var t=$(this).attr("class").replace("trk-cta-link","").replace("cta-","").replace(/ /g,"");""!=t&&$(this).attr("data-action-tier",t).attr("data-click-type","promo").attr("data-click-text",trackGTM.Utils.PrepareTaggingText($(this)))})}catch(t){console.log(t.message)}$(trackGTM.Constants.classMenuTrack).each(function(){if(!$(this).hasClass(trackGTM.Constants.classNoGTMTrack)&&!$(this).parent().hasClass(trackGTM.Constants.classNoGTMTrack)){var t=trackGTM.Utils.PrepareTaggingText($(this));$(this).attr(trackGTM.Constants.trkMenuValue,t)}})},itemclick:function(){$(trackGTM.Constants.classMenuTrack).click(function(){if(!$(this).hasClass(trackGTM.Constants.classNoGTMTrack)&&!$(this).parent().hasClass(trackGTM.Constants.classNoGTMTrack)){var t=$(this).attr(trackGTM.Constants.trkMenuType);if(void 0!==t&&t.length>0){var a=$(this).attr(trackGTM.Constants.trkMenuValueOverride),n="";if(void 0!==a&&a.length>0)n=a;else{var e=$(this).attr(trackGTM.Constants.trkMenuValue);void 0!==e&&e.length>0&&(n=e)}var r={event:trackGTM.Constants.valMenuEventValue,menuName:n,menuType:t},i=$(this).attr(trackGTM.Constants.trkMenuActionTier);void 0!==i&&null!=i&&i.length>0&&$.extend(r,{actionTier:i}),dataLayer.push(r)}}})}},share:{init:function(){this.itemclick()},itemclick:function(){$(trackGTM.Constants.classShareTrack).click(function(){if(!$(this).hasClass(trackGTM.Constants.classNoGTMTrack)&&!$(this).parent().hasClass(trackGTM.Constants.classNoGTMTrack)){var t=$(this).attr(trackGTM.Constants.trkShareType);if(void 0!==t&&t.length>0){var a={event:trackGTM.Constants.valShareEventValue,shareType:t};"undefined"!=typeof _shareActionTier&&null!=_shareActionTier&&$.extend(a,{actionTier:_shareActionTier}),dataLayer.push(a)}}})}},quiz:{init:function(){this.load()},load:function(){$(trackGTM.Constants.classQuizModuleTrack).each(function(){var t=$(this);if(!t.hasClass(trackGTM.Constants.classNoGTMTrack)){var a=trackGTM.Utils.PrepareTaggingText(t.find(".fact_or_fiction_callout:first").find(".cta_copy:first"));t.attr(trackGTM.Constants.trkQuizNameValue,a),t.find(".fact_or_fiction_callout:first").find(".fact_or_fiction_callout_button").each(function(){$(this).on("click",function(){trackGTM.quiz.responseClick($(this))})}),t.find(".fact_or_fiction_callout:nth-child(2)").find(".fact_or_fiction_callout_button").each(function(){$(this).on("click",function(){trackGTM.quiz.learnmoreClick($(this))})})}})},responseClick:function(t){if("undefined"!=typeof dataLayer){var a=t;if(!a.hasClass(trackGTM.Constants.classNoGTMTrack)){var n=a.closest("div.callout_type3_container");if(n.length){var e=n.attr(trackGTM.Constants.trkQuizNameValueOverride),r="";if(void 0!==e&&e.length>0)r=e;else{var i=n.attr(trackGTM.Constants.trkQuizNameValue);void 0!==i&&i.length>0&&(r=i)}var c=trackGTM.Utils.PrepareTaggingText(a),s={event:trackGTM.Constants.valQuizAnswerEventValue,quizName:r,answerClicked:c},o=n.attr(trackGTM.Constants.trkQuizActionTier);void 0!==o&&null!=o&&o.length>0&&$.extend(s,{actionTier:o}),dataLayer.push(s)}}}},learnmoreClick:function(t){if("undefined"!=typeof dataLayer){var a=t;if(!a.hasClass(trackGTM.Constants.classNoGTMTrack)){var n=a.closest(".callout_type3_container");if(n.length){var e=n.attr(trackGTM.Constants.trkQuizNameValueOverride),r="";if(void 0!==e&&e.length>0)r=e;else{var i=n.attr(trackGTM.Constants.trkQuizNameValue);void 0!==i&&i.length>0&&(r=i)}var c={event:trackGTM.Constants.valQuizLearnmoreEventValue,quizName:r},s=n.attr(trackGTM.Constants.trkQuizActionTier);void 0!==s&&null!=s&&s.length>0&&$.extend(c,{actionTier:s}),dataLayer.push(c)}}}}},form:{dlpush:function(t,a){if(null!=t&&("e_inPageClickNav"==t.event&&t.hasOwnProperty("clickAction")&&null!=t.clickAction||"e_inPageClickNav"!=t.event)&&"undefined"!=typeof dataLayer){if(void 0!==a&&a){var n=$.cookie("OID");void 0!==n&&null!=n&&n.length>0&&$.extend(t,{userId:n})}dataLayer.push(t)}}},Utils:{StripHtmlInInnerText:function(t,a){var n=document.createElement("DIV");n.innerHTML=void 0!==a&&a?t.parent().html():t.html();var e=n.textContent||n.innerText||"";return e.replace("​",""),e=e.trim()},PrepareTaggingText:function(t,a){var n=["?",'"',"'","®","™","¿"],e=this.StripHtmlInInnerText(t,a).toLowerCase();for(e=(e=e.replace(/(\r\n|\n|\r)/gm,"")).replace("   "," ").replace("  "," ").replace("  "," "),i=0;i<n.length;i++)e=e.replace(n[i],"");return e}}};$(function(){trackGTM.init()});