define(['jquery'],function ($) {
    var exportsObj = {};
    exportsObj.getInitData = function(jid,CFG){
        if (typeof jid == 'undefined') {
            console.error('===缺失jid===');
            return false;
        }
        $.ajax({
          url: 'jackpot/preexecute.do',
          type: 'POST',
          data: {
            "jid":jid
          },
          complete: function(xhr, textStatus) {
            //called when complete
          },
          success: function(data, textStatus, xhr) {
            console.log('preexecute:'+data);
          },
          error: function(xhr, textStatus, errorThrown) {
            //called when there is an error
          }
        });
        
    }
    return exportsObj;
})