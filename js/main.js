(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('scene');
  if (canvas && window.THREE) {
    var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 9;
    var group = new THREE.Group();
    scene.add(group);
    var N = 46, pts = [], R = 3.4;
    for (var i = 0; i < N; i++) {
      var phi = Math.acos(1 - 2 * (i + .5) / N), th = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push(new THREE.Vector3(R*Math.sin(phi)*Math.cos(th), R*Math.sin(phi)*Math.sin(th), R*Math.cos(phi)));
    }
    var nodeGeo = new THREE.SphereGeometry(.09, 12, 12);
    pts.forEach(function(p, i){
      var m = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({color: i % 7 === 0 ? 0xffb454 : 0x8b7bff}));
      m.position.copy(p); group.add(m);
    });
    var verts = [];
    for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++)
      if (pts[a].distanceTo(pts[b]) < 1.9) verts.push(pts[a].x,pts[a].y,pts[a].z,pts[b].x,pts[b].y,pts[b].z);
    var lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    group.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({color:0x4a4390, transparent:true, opacity:.6})));
    var mx = 0, my = 0;
    addEventListener('pointermove', function(e){ mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    function resize(){
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      camera.updateProjectionMatrix(); camera.updateMatrixWorld();
      var p = document.getElementById('portrait').getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      var nx = ((p.left + p.width/2 - cr.left) / w) * 2 - 1, ny = -(((p.top + p.height/2 - cr.top) / h) * 2 - 1);
      var v = new THREE.Vector3(nx, ny, .5).unproject(camera).sub(camera.position).normalize();
      group.position.copy(camera.position).addScaledVector(v, -camera.position.z / v.z);
      var pxPerUnit = h / (2 * camera.position.z * Math.tan(camera.fov * Math.PI / 360));
      group.scale.setScalar(Math.max(.5, Math.min(1.1, (p.width * 1.3) / pxPerUnit / R)));
    }
    addEventListener('resize', resize); resize();
    (function loop(){
      if (!reduce) { group.rotation.y += .002 + mx * .01; group.rotation.x += (my * .6 - group.rotation.x) * .03; }
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    })();
  }
  if (!reduce) document.querySelectorAll('.tilt').forEach(function(el){
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = 'perspective(700px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg) translateZ(6px)';
    });
    el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
  });
})();
