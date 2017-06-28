<template>
  <div id="MyViewerDiv" class="hero is-fullheight">
      Por favor aguarde carregamento do modelo...
  </div>
</template>

<script>
var v
import axios from 'axios'
export default {
  computed: {
    documentId () {
      return this.$store.state.documentId
    }
  },
  methods: {
    initialize () {
      var viewerApp
      var viewables
      var documentId = this.documentId
      console.log(documentId)
      var initOptions = {
        env: 'AutodeskProduction',
        useConsolidation: true,
        /*extensions:['Autodesk.Viewing.webVR'],*/
        getAccessToken: function(onGetAccessToken) {
            var accessToken, expire;
            axios('/api/token/').then(function (resp) {
                //console.log(resp.data);
                accessToken = resp.data.access_token;
                expire = resp.data.expires_in;
                //console.log(accessToken);
                onGetAccessToken(accessToken, expire); // tinha deixado fora e deu problema de loop infinito, tem que ser dentro do callback
            });
        }
      };
      Autodesk.Viewing.Initializer(initOptions, function onInitialized() {
        console.log("initialization started");
        viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
        viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
        viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
      });
      function onDocumentLoadSuccess (doc) {
        console.log(doc)
        viewables = viewerApp.bubble.search({'type':'geometry'});
        var indexViewable = 0;
        if (viewables.length === 0) {
            console.error('Document contains no viewables.');
            return;
        }
        // Choose any of the avialble viewables
        viewerApp.selectItem(viewables[indexViewable].data, onItemLoadSuccess, onItemLoadFail);
      }
      function onDocumentLoadFailure (viewerErrorCode) {
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
      }
      function onItemLoadSuccess (viewer, item) {
        v = viewer; // in production, converto to locl scope
        //IMPORTANTE, set units. All models from revit will come in cm.
        v.setModelUnits('cm');
      
        //quando terminar de carregar chama onGeometryLoaded
        v.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
      }
      function onItemLoadFail (errorCode) {
          console.error('onItemLoadFail() - errorCode:' + errorCode);
      }
      function onGeometryLoaded (event) {

      }
    }
  },
  mounted () {
    this.initialize()
  }
}
</script>


