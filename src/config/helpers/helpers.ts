
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
    },

    formatDate(date: any, options: any) {
        return `<b>${date.toString().split(`GMT`)[0]}</b>`
    },

    setFormatStatus(status: string, options: any) {

        if(status == `APROBADO`) return `<span style="color:#0025ed">${status}</span>`;
        if(status == `RECIVIDO`) return `<span style="color:#7faf2d">${status}</span>`;
        if(status == `REVISION`) return `<span style="color:#afaf2d">${status}</span>`;
        if(status == `FINALIZADO`) return `<span style="color:#09d14e">${status}</span>`;
        // if(status == `APROBADO`) return `<span style="color:#0025ed">${status}</span>`;

        return `<span style="color:#000">${status}</span>`;

    },

    activeArea(area: boolean, nameArea: string, options:any) {
        if(area) {
            return `
                <div class="form-group col-12 col-md-6 col-lg-4">
                    <label for="t-vip" class="">${nameArea}</label>
                    <input id="t-vip" type="checkbox" name="vip_bar" checked class="form-control">
                </div>
            `;
        }
        return `
            <div class="form-group col-12 col-md-6 col-lg-4">
                <label for="t-vip" class="">${nameArea}</label>
                <input id="t-vip" type="checkbox" name="vip_bar" class="form-control">
            </div>
        `;
    }
    
};

export default Helpers;
