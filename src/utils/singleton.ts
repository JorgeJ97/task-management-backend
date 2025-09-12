export function Singleton<T extends new (...args: any[]) => {}>(constructor: T) {
  let instance: any; // Variable en closure, persiste entre llamadas
  
  return class extends constructor { // Nueva clase que reemplaza la original
    constructor(...args: any[]) {
      if (instance) { // Si ya existe, retorna la existente
        return instance;
      }
      super(...args); // Llama constructor original
      instance = this; // Guarda esta instancia
      return instance;
    }
    
    static getInstance(...args: any[]) { // Método clásico del Singleton
      if (!instance) {
        instance = new this(...args)
      }
      return instance;
    }
  };
}