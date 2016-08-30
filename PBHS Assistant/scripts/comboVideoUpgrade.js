chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "comboVideoUpgrade":
      upgradeVideos(sendResponse);
      return true;
      break;
  }
});

function upgradeVideos(callback) {
  var status = {
    completed: false,
    message: "Couldn't find all shortcodes"
  }
  var field = "content";
  originalText = document.getElementById(field).value;
  replacedText = replaceAllHumanTouch(originalText);
  replacedText = replaceAllSilentAnimations(replacedText);
  document.getElementById(field).value = replacedText;
  if (replacedText.indexOf("[COULDN'T FIND SHORTCODE]") == -1) {
    status.completed = true;
    status.message = "Videos Upgraded";
  }
  callback(status);
}

function replaceAllHumanTouch(originalText) {
  var shortCode = "";
  var replacedText;
  var type;
  var alignment;
  if (originalText.search(
    /<div class="module align(.*?)">[\s\S]*?<h2>(.*?)<\/h2>[\s\S]*?<\/p>[\s\S]*?<\/div>/i
  ) == -1) {
    return originalText;
  } else {
    originalText.replace(
      /<div class="module align(.*?)">[\s\S]*?<h2>(.*?)<\/h2>[\s\S]*?<\/p>[\s\S]*?<\/div>/i,
      function() {
        alignment = arguments[1];
        type = arguments[2];
      });
    if (!(type in HT_SHORTCODES)) {
      shortCode = "[COULDN'T FIND SHORTCODE]";
    } else {
      shortCode = HT_SHORTCODES[type];
    }
    shortCode = shortCode.replace("]", " align=" + alignment + "]");
    replacedText = originalText.replace(
      /<div class="module align(.*?)">[\s\S]*?<h2>(.*?)<\/h2>[\s\S]*?<\/p>[\s\S]*?<\/div>/i,
      "\n" + shortCode);
  }
  return replaceAllHumanTouch(replacedText);
}

function replaceAllSilentAnimations(originalText) {
  var shortCode = "";
  var originalText;
  var replacedText;
  var results = [];
  var alignment = [];
  if (originalText.indexOf("videoKeyword") == -1 && originalText.indexOf(
    "id=\"proc_") == -1) {
    return originalText;
  } else {
    if (originalText.indexOf("videoKeyword") == -1) {
      originalText.replace(/id="proc_(.*?)"/i, function() {
        results.push(arguments[1]);
      });
      originalText.replace(/style="float:(.*?); margin:.*?id="proc_.*?"/i,
        function() {
          alignment.push(arguments[1]);
        });
    } else {
      originalText.replace(/videoKeyword=(.*?)('|")/i, function() {
        results.push(arguments[1]);
      });
    }
    if (!(results in SA_SHORTCODES)) {
      shortCode = "[COULDN'T FIND SHORTCODE]";
    } else {
      shortCode = SA_SHORTCODES[results];
    }
    if (originalText.indexOf("videoKeyword") == -1) {
      if (alignment.length > 0) {
        shortCode = shortCode.replace("]", " align=" + alignment + "]")
      }
      replacedText = originalText.replace(
        /<div.*?id="proc_(.*?)".*?>.*?<\/div>/, shortCode);
    } else {
      replacedText = originalText.replace(
        /<div\s*style="[^T].*>[\s\S]*?videoKeyword[\s\S]*?<\/div>/,
        shortCode);
    }
    return replaceAllSilentAnimations(replacedText);
  }
}
var HT_SHORTCODES = [];
HT_SHORTCODES["Dental Implant Presentation"] = "[HT_IMPLANT]";
HT_SHORTCODES["Endodontic Presentation"] = "[HT_ENDO]";
HT_SHORTCODES["Wisdom Teeth Presentation"] = "[HT_WISDOM]";
HT_SHORTCODES["Wisdom Tooth Presentation"] = "[HT_WISDOM]";
HT_SHORTCODES["Orthognathic Surgery Presentation"] = "[HT_ORTHO]";
HT_SHORTCODES["Dental Implant Overview"] = "[MINI_IMPLANT]";
HT_SHORTCODES["Bone Grafting Overview"] = "[MINI_GRAFTING]";
HT_SHORTCODES["Wisdom Tooth Removal Overview"] = "[MINI_WISDOM]";
HT_SHORTCODES["Orthognathic Surgery Overview"] = "[MINI_ORTHO]";
HT_SHORTCODES["TMJ Surgery Overview"] = "[MINI_TMJ]";
var SA_SHORTCODES = [];
//partial list of old broken silent animation code
SA_SHORTCODES["sinuscommunication_320"] = "[SA_SINUS_COMMUNICATION]";
SA_SHORTCODES["Whitening_320"] = "[SA_WHITENING]";
SA_SHORTCODES["Lasergum_320"] = "[SA_GUM_DISEASE]";
SA_SHORTCODES["Implant_320"] = "[SA_IMPLANT]";
SA_SHORTCODES["Root_Canal_320"] = "[SA_ROOT_CANAL]";
SA_SHORTCODES["pulp_320"] = "[SA_PULP]";
SA_SHORTCODES["Filling_320"] = "[SA_FILLINGS]";
SA_SHORTCODES["Veneer_320"] = "[SA_VENEER]";
SA_SHORTCODES["Sealants_320"] = "[SA_SEALANTS]";
SA_SHORTCODES["Denture_320"] = "[SA_DENTURES]";
SA_SHORTCODES["Bridge_320"] = "[SA_BRIDGES]";
SA_SHORTCODES["Crown_320"] = "[SA_CROWNS]";
SA_SHORTCODES["Extraction_320"] = "[SA_EXTRACTIONS]";
SA_SHORTCODES["Bonding_320"] = "[SA_BONDING]";
SA_SHORTCODES["Onlay_320"] = "[SA_INLAY_ONLAY]";
SA_SHORTCODES["Gum_Disease_320"] = "[SA_GUM_DISEASE]";
SA_SHORTCODES["TeethInAnHour_320"] = "[SA_TEETH_IN_HOUR]";
SA_SHORTCODES["BoneGrafting_320"] = "[SA_GRAFTING]";
SA_SHORTCODES["Wisdom_320"] = "[SA_WISDOM]";
SA_SHORTCODES["OrthoBottom_320"] = "[SA_ORTHO_BOTTOM]";
SA_SHORTCODES["OrthoTop_320"] = "[SA_ORTHO_TOP]";
SA_SHORTCODES["TMJ_Normal_320"] = "[SA_TMJ]";
SA_SHORTCODES["Filling_Amalgam_320"] = "[SA_AMALGAM]";
SA_SHORTCODES["Cerec_320"] = "[SA_CEREC]";
SA_SHORTCODES["Cavities_320"] = "[SA_FILLINGS]";
SA_SHORTCODES["LaserGum_320"] = "[SA_GUM_DISEASE]";
SA_SHORTCODES["Gum_Graft_320"] = "[SA_GUM_GRAFTING]";
SA_SHORTCODES["apico_320"] = "[SA_APICOECTOMY]";
//complete list of still working older SA_SHORTCODES
SA_SHORTCODES["implant"] = "[SA_IMPLANT]";
SA_SHORTCODES["bonegrafting"] = "[SA_GRAFTING]";
SA_SHORTCODES["teeth_in_an_hour"] = "[SA_TEETH_IN_HOUR]";
SA_SHORTCODES["sinuslift"] = "[SA_SINUS_LIFT]";
SA_SHORTCODES["socket_preservation"] = "[SA_SOCKET_PRESERVATION]";
SA_SHORTCODES["wisdom"] = "[SA_WISDOM]";
SA_SHORTCODES["orthog"] = "[SA_ORTHO_TOP]";
SA_SHORTCODES["orthog_bottom"] = "[SA_ORTHO_BOTTOM]";
SA_SHORTCODES["tmj"] = "[SA_TMJ]";
SA_SHORTCODES["facial_trauma"] = "[SA_FACIAL_TRAUMA]";
SA_SHORTCODES["sleepapnea"] = "[SA_SLEEP_APNEA]";
SA_SHORTCODES["filling"] = "[SA_FILLINGS]";
SA_SHORTCODES["filling_amalgam"] = "[SA_AMALGAM]";
SA_SHORTCODES["sealants"] = "[SA_SEALANTS]";
SA_SHORTCODES["denture"] = "[SA_DENTURES]";
SA_SHORTCODES["bridge"] = "[SA_BRIDGES]";
SA_SHORTCODES["crown"] = "[SA_CROWNS]";
SA_SHORTCODES["extraction"] = "[SA_EXTRACTIONS]";
SA_SHORTCODES["laser_gum"] = "[SA_GUM_DISEASE]";
SA_SHORTCODES["lanap"] = "[SA_LANAP]";
SA_SHORTCODES["root_canal"] = "[SA_ROOT_CANAL]";
SA_SHORTCODES["bonding"] = "[SA_BONDING]";
SA_SHORTCODES["veneer"] = "[SA_VENEER]";
SA_SHORTCODES["inlay_onlay"] = "[SA_INLAY_ONLAY]";
SA_SHORTCODES["whitening"] = "[SA_WHITENING]";
SA_SHORTCODES["cerec"] = "[SA_CEREC]";
SA_SHORTCODES["gum_disease"] = "[SA_GUM_DISEASE]";
SA_SHORTCODES["crownlengthening"] = "[SA_CROWN_LENGTHENING]";
SA_SHORTCODES["gum_graft"] = "[SA_GUM_GRAFTING]";
SA_SHORTCODES["pulp"] = "[SA_PULP]";
SA_SHORTCODES["sinus_communication"] = "[SA_SINUS_COMMUNICATION]";
SA_SHORTCODES["endo_retreatment"] = "[SA_ENDO_RETREATMENT]";
SA_SHORTCODES["apicoectomy"] = "[SA_APICOECTOMY]";
SA_SHORTCODES["cracked_teeth"] = "[SA_CRACKED_TEETH]";
SA_SHORTCODES["dislodged"] = "[SA_DISLODGED]";
SA_SHORTCODES["avulsed"] = "[SA_AVULSED]";
SA_SHORTCODES["haderbar"] = "[SA_ALL_ON_FOUR]";
SA_SHORTCODES["lapip"] = "[SA_LAPIP]";
SA_SHORTCODES["depigmentation"] = "[SA_DEPIGMENTATION]";
//av SA_SHORTCODES
SA_SHORTCODES["cosmetic_implant_av"] = "[SA_IMPLANT]";
SA_SHORTCODES["filling_av"] = "[SA_FILLINGS]";
SA_SHORTCODES["sealants_av'"] = "[SA_SEALANTS]";
SA_SHORTCODES["bridge_av"] = "[SA_BRIDGES]";
SA_SHORTCODES["crown_av"] = "[SA_CROWNS]";
SA_SHORTCODES["extraction_av"] = "[SA_EXTRACTIONS]";
SA_SHORTCODES["bonding_av"] = "[SA_BONDING]";
SA_SHORTCODES["veneer_av"] = "[SA_VENEER]";
SA_SHORTCODES["whitening_av"] = "[SA_WHITENING]";
SA_SHORTCODES["gum_disease_av"] = "[SA_GUM_DISEASE]";
SA_SHORTCODES["infection_control_av"] = "[SA_INFECTION]";
SA_SHORTCODES["initial_av"] = "[SA_INITIAL]";
SA_SHORTCODES["postop_av"] = "[SA_POSTOP]";
SA_SHORTCODES["welcome_av"] = "[SA_WELCOME]";
