(function(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    document.querySelectorAll('.fill').forEach(function(f){f.style.width=f.dataset.w+'%';});
  });});
})();