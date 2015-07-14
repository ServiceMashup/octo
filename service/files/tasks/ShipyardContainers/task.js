var options = {
  url: 'http://46.101.191.124:8080',
  headers: { 'X-Service-Key': 'pdE4.JVg43HyxCEMWvsFvu6bdFV7LwA7YPii' }
};
var containers = new Containers();
containers[task.method.toLowerCase()]();

function Containers(){

  this.get = read;
  this.post = create;
  this.delete = remove;
  
  function create(){
  
  	var conf = {
    	name: '46.101.191.124:5000/' + task.params.name + ':' + task.params.version,
        cpus: task.params.cpu || 0.1,
		memory: task.params.memory || 32,
        hostname: task.params.hostname || '',
        domain: task.params.domain || '',
        type: 'service',
        bind_ports: [
           {
              proto: 'tcp',
              host_ip: null,
              port: task.params.port,
              container_port: task.params.port
           }
        ],
        labels:task.params.labels || [],
        environment: task.params.environment || {}
    };
  
  
  	return task.json(options)
    	.post('/api/containers?pull=true', conf)
        .then(function(data){
          task.done(null, data);
       	})
        .catch(function(error){
          task.done(error);
        });
  }
  
  function read(){
    return task.json(options)
     .get('/api/containers')
     .then(function(data){
        task.done(null, data);
     })
     .catch(function(error){
     	task.done(error);
     });
  }
  
  function remove(){
  
    return task.json(options)
     .del('/api/containers/'+task.params[1])
     .then(function(data){
        task.done(null, data);
     })
     .catch(function(error){
     	task.done(error);
     });
  }

}