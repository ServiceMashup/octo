task
 .json({
 	url: 'http://46.101.191.124:8080',
    headers: {
    	'X-Service-Key': 'pdE4.JVg43HyxCEMWvsFvu6bdFV7LwA7YPii'
    },    
 })
 .get('/api/containers')
 .then(function(data){
	task.done(null, data);
 });