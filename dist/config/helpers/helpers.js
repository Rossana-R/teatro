"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers = {
    ifeq(path, page, options) {
        if (path === page) {
            return options.fn(`bello`);
        }
        return options.inverse(`no bello`);
    },
    validRoot(rol, options) {
        return rol == `ROOT` ? options.fn(true) : options.inverse(false);
    },
    formatDate(date, options) {
        return `<b>${date.toString().split(`GMT`)[0]}</b>`;
    },
    setFormatStatus(status, options) {
        if (status == `APROBADO`)
            return `<span style="color:#0025ed">${status}</span>`;
        if (status == `RECIVIDO`)
            return `<span style="color:#7faf2d">${status}</span>`;
        if (status == `REVISION`)
            return `<span style="color:#afaf2d">${status}</span>`;
        if (status == `FINALIZADO`)
            return `<span style="color:#09d14e">${status}</span>`;
        // if(status == `APROBADO`) return `<span style="color:#0025ed">${status}</span>`;
        return `<span style="color:#000">${status}</span>`;
    },
    activeArea(area, nameArea, name, options) {
        if (area) {
            return `
                <div class="form-group col-12 col-md-6 col-lg-4">
                    <label for="t-vip" class="">${nameArea}</label>
                    <input id="t-vip" type="checkbox" name="${name}" checked class="form-control">
                </div>
            `;
        }
        return `
            <div class="form-group col-12 col-md-6 col-lg-4">
                <label for="t-vip" class="">${nameArea}</label>
                <input id="t-vip" type="checkbox" name="${name}" class="form-control">
            </div>
        `;
    },
    validEventWeeck(data, options) {
        if (data == null || data == undefined) {
            return `
            <div class="item-timeline">
                <div class="t-dot" data-original-title="" title="">
                </div>
                <div class="t-text">
                    <p>no tienes eventos</p>
                    <p class="t-time">...</p>
                </div>
            </div>
            `;
        }
        return `
            <div class="item-timeline timeline-primary">
                <div class="t-dot" data-original-title="" title="">
                </div>
                <div class="t-text">
                    <p>${data.event_name}</p>
                    <span class="badge badge-primary">${data.admin_status}</span>
                    <p class="t-time">${data.admin_date}</p>
                </div>
            </div>
        `;
    },
    Dashboard1(name, count, options) {
        return `
            <div class="transactions-list">
                <div class="t-item">
                    <div class="t-company-name">
                        <div class="t-icon">
                            <div class="icon">
                                <img src="/ico/etiquetas.svg" width="18" />
                            </div>
                        </div>
                        <div class="t-name">
                            <h4>${name}</h4>
                        </div>

                    </div>
                    <div class="t-rate rate-dec" style="color:#482">
                        <p><span>${count}</span></p>
                    </div>
                </div>
            </div>
        `;
    },
    SepareTDate(name, date, options) {
        return `${name} <b>${date.toString().split(`T`)[0]} - ${date.toString().split(`T`)[1]}</b>`;
    },
    CheckArea(name, area, options) {
        return area ? `<p>${name} <b>reservado</b></p>` : `<p></p>`;
    }
};
exports.default = Helpers;
