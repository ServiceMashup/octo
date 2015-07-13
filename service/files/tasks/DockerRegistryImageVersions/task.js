task
 .json({url: 'http://46.101.191.124:5000'})
 .get('/v2/'+task.params.service+'/tags/list')
 .then(function(data){
	task.done(null, data.tags);
 });