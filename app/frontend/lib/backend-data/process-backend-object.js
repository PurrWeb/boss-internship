import _ from "underscore"

export function getClientId(serverId){
    if (serverId === undefined){
        throw new Error("Server ID cannot be undefined");
    }
    return "CLIENT_ID_" + serverId;
}

function setObjectIds(obj){
    obj.serverId = obj.id;
    delete obj.id;
    obj.clientId = getClientId(obj.serverId);

    return obj;
}

function valueIsLink(value){
    if (value === null || value === undefined){
        return false;
    }
    return value.id !== undefined;
}

function makeLinkResolverFunction(link, key){
    return function(linkObjectsByClientId){
        var resolvedLink = linkObjectsByClientId[link.clientId];
        if (resolvedLink === undefined) {
            throw new Error("Couldn't resolve " + key + " with clientId " + link.clientId);
        }
        return resolvedLink;
    }
}

function processLinkObject({link, parent, key}){
    link.clientId = getClientId(link.id);
    link.serverId = link.id;
    delete link.id;
    link.get = makeLinkResolverFunction(link, key);
    link.getParentForDebugging = () => obj;
}

function processObjectLinks(obj){
    for (var key in obj){
        var value = obj[key];
        if (_.isArray(value)) {
            // if the array items are links process them
            if (value.length > 0) {
                if (valueIsLink(value[0])) {
                    value.forEach((link,i) => {
                        processLinkObject({
                            link,
                            parent: obj,
                            key: key + "." + i
                        })
                    });
                }
            }
        }
        if (valueIsLink(value)) {
            processLinkObject({
                link: value,
                parent: obj,
                key
            });
        }
    }
}

export function processBackendObject(backendObj){
    if (backendObj.clientId !== undefined){
        throw new Error("Backend object has already been processed.");
    }
    var obj = {...backendObj};

    setObjectIds(obj);
    processObjectLinks(obj);
    
    return obj;
}

export {processObjectLinks}