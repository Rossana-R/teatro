
const Helpers = {
    ifeq(path: string, page: string, options: any) {

        if (path === page) {
            console.log(this);
            return options.fn(`bello`);
          }
        return options.inverse(`no bello`);
    },
    
    validRoot(rol: string, options: any) {
        return rol == `ROOT` ? options.fn(true) : options.inverse(false);
    }
    
};

export default Helpers;
