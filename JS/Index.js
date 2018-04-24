//Import modules

require([
//Module ID's
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "esri/layers/MapImageLayer",
    "esri/PopupTemplate",
    "dojo/domReady!"

], function (Map, MapView, FeatureLayer, Legend, LayerList, Search, Locator, MapImageLayer, PopupTemplate) {
    //Code starts here:

    //Config and add map
    var mapConfig = { basemap: "hybrid" }; 
    var newmap = new Map(mapConfig);  //using one config file can be used across multiple maps.

    //Configs the mapview
    var viewConfig = {
        map: newmap,
        container: "viewDiv",
        zoom: 12,
        center: [-82.56, 27.455]

    };

    //creates the mapview with above config
    var mapview = new MapView(viewConfig);

    //Adds the symbols for each class in the freeway layer.
    var FreewaySymbol = {
        type: "simple-line",
        style: "short-dash-dot",
        width: 4,
        color: [255, 190, 190, 1]
    };

    var HighwaySymbol = {
        type: "simple-line",
        style: "short-dash-dot-dot",
        width: 3,
        color: [115, 76, 0, 1]
    };

    var defaultSymbol = {
        type: "simple-line",
        width: 2,
        color: [230, 0, 169, 1]
    };

    var defaulthouseSymbol = {
        type: "simple-line",
        width: 2,
        color: [230, 0, 169, 1]
    };

    var LowSymbol = {
        type: "simple-line",
        width: 2,
        color: [11, 76, 10, 1]
    };

    //Creates the renderer for hwy feature layer
    var myhwyRenderer = {
        type: "unique-value",
        field: "Class",
        defaultSymbol: defaultSymbol,
        defaultLabel: "Slowly",
        uniqueValueInfos: [
            {value: "I", symbol: FreewaySymbol, label: "Very Quickly" },
            {value: "U", symbol: HighwaySymbol, label: "Somewhat Quickly"}]
    };

    //Overrides the sub-title in the legend.  Otherwise would be "field."
    myhwyRenderer.legendOptions = {title: "How Fast Can I Get There?"};

    //Hwy feature service popup template
    var hwytemplate = new PopupTemplate ({
        title: "Road Info",
        content: "Name: {Route_Num} <br/> Type: {Class}"

    });
    //Map Service Popup template
    var cattemplate = new PopupTemplate({
        title: "Case Number:",
        content: "{CASENO}"

    });

    //Road Feature Layer
    var hwyfeaturelayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System/FeatureServer/2",
        title: "How to get to Kitties!",
        popupTemplate: hwytemplate,
        renderer: myhwyRenderer
    });


    //Cat dynamic map service
    var catrescueLayer = new MapImageLayer({
        url: "https://www.mymanatee.org/arcgis01/rest/services/pubsafety/animalcalltype/MapServer/",
        title: "Kitties",
        sublayers: [{
            id: 12,
            title: "Abandoned Cats",
            type: "simple",
            popupTemplate: cattemplate,
            visible: true
        },{
            id: 11,
            title: "Cat Rescues",
            type: "simple",
            popupTemplate: cattemplate,
            visible:false
        }]
 
    });

    //Adds layers to map.
    newmap.add(hwyfeaturelayer);
     newmap.add(catrescueLayer);

    //Creates legend
    var legend = new Legend({
        view: mapview,
        layerInfos: [{
            layer: hwyfeaturelayer,
            title: "How to get to the kitties"
        },{
            layer: catrescueLayer,
            title: "Kitties in Distress"
        }]
    });
    //Adds legend to the UI
    mapview.ui.add(legend, "bottom-right");

    //Adding table of contents
    var TOClayerlist = new LayerList({
        view: mapview

    });
    //Adding TOC to UI
    mapview.ui.add(TOClayerlist, "bottom-left");

    //Adding search widget
    var searchWidget = new Search({
        view: mapview,
        sources: [
            //ESRI's geocoder, not necessary for this app.
            //{
            //locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
            //singleLineFieldName: "SingleLine",
            //name: "Custom Geocoding Service",
            //localSearchOptions: {
            //    minScale: 300000,
            //    distance: 50000
            //},
            //placeholder: "Search Geocoder",
            //maxResults: 3,
            //maxSuggestions: 6,
            //suggestionsEnabled: false,
            //minSuggestCharacters: 0
            //},
            {
            featureLayer: hwyfeaturelayer,
            searchFields: ["ROUTE_NUM"],
            displayField: "ROUTE_NUM",
            exactMatch: false,
            outFields: ["*"],
            name: "Roads",
            placeholder: "example: C18",
            maxResults: 6,
            maxSuggestions: 6,
            suggestionsEnabled: true,
            withinViewEnabled: true, 
            zoomScale:6,
            minSuggestCharacters: 0
            }, {
                featureLayer: "https://www.mymanatee.org/arcgis01/rest/services/pubsafety/animalcalltype/MapServer/11",
            searchFields: ["CASENO"],
            displayField: "CASENO",
            exactMatch: false,
            outFields: ["*"],
            name: "Rescued Cats Case No.",
            placeholder: "A12-037450",
            maxResults: 6,
            maxSuggestions: 6,
            suggestionsEnabled: true,
                minSuggestCharacters: 0
            }, {
                featureLayer: "https://www.mymanatee.org/arcgis01/rest/services/pubsafety/animalcalltype/MapServer/12",
                searchFields: ["CASENO"],
                displayField: "CASENO",
                exactMatch: false,
                outFields: ["*"],
                name: "Abandoned Cats Case No.",
                placeholder: "A12-037450",
                maxResults: 6,
                maxSuggestions: 6,
                suggestionsEnabled: true,
                minSuggestCharacters: 0
            }]
    });

    mapview.ui.add(searchWidget, "top-right");


//Code ends here:
});
