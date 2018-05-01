import emitter from './event.emitter';
import handlers from './handlers';

_.each(handlers, (value, key) => {
     emitter.on(key, handlers[key]);
});

function emit(event, args) {
     emitter.emit(event, args);
}

export default {
     emit
};
