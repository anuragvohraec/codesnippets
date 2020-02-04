class DAO {
    constructor(databaseName, version, listofDBDetails) {
        if (window.indexedDB) {
            this.databaseName = databaseName;
            this.req = window.indexedDB.open(databaseName, version);

            this.req.onupgradeneeded = (e) => {
                this.db = this.req.result;
                listofDBDetails.forEach(element => {
                    this.createObjectStore(element.name, element.primaryKeyName);
                });
            };

            this.isInitialized = new Promise((res, rej) => {
                this.req.onsuccess = (e) => {
                    this.db = this.req.result;
                    res(true);
                };
            });
        }
    }

    createObjectStore(dbname, primaryKeyName) {
        if (!this.db.objectStoreNames.contains[dbname]) {
            if (primaryKeyName) {
                this.db.createObjectStore(dbname, { keyPath: primaryKeyName })
            } else {
                this.db.createObjectStore(dbname, { autoIncrement: true })
            }
        }
    }

    async create(dbname, objectToSave) {
        if (await this.isInitialized) {
            const req = this.db.transaction([dbname], 'readwrite')
                .objectStore(dbname)
                .add(objectToSave);

            const event = await (async () => {
                return new Promise((res, rej) => {
                    req.onsuccess = res;
                    req.onerror = rej;
                });
            })();
            return event.type == 'success';
        }
    }
    // if no index value is passed than it returns all results
    async read(dbname, indexValue) {
        if (await this.isInitialized) {
            const transaction = this.db.transaction([dbname]);
            const objectStore = transaction.objectStore(dbname);
            if (indexValue) {
                const req = objectStore.get(indexValue);
                const event = await (async () => {
                    return new Promise((res, rej) => {
                        req.onsuccess = res;
                        req.onerror = rej;
                    });
                })();
                return event.target.result;
            } else {
                const event = await (async () => {
                    return new Promise((res, rej) => {
                        objectStore.getAll().onsuccess = res;
                    })
                })();
                return event.target.result;
            }
        }
    }

    async update(dbname, newUpdatedObject) {
        if (await this.isInitialized) {
            const req = this.db.transaction([dbname], 'readwrite')
                .objectStore(dbname)
                .put(newUpdatedObject);
            const event = await (async () => {
                return new Promise((res, rej) => {
                    req.onsuccess = res;
                    req.onerror = rej;
                });
            })();
            return event.type == 'success';
        }
    }

    async delete(dbname, indexValue) {
        if (await this.isInitialized) {
            const req = this.db.transaction([dbname], 'readwrite')
                .objectStore(dbname)
                .delete(indexValue);
            const event = await (async () => {
                return new Promise((res, rej) => {
                    req.onsuccess = res;
                    req.onerror = rej;
                });
            })();
            return event.type == 'success';
        }
    }

}

/*usage
         const dao = new DAO('myapp','1.0',[{name: 'test1', primaryKeyName: 'name'}]);
        (async ()=>{
           try{
            if(await dao.isInitialized){
                const t0= await dao.create('test1', {name: 'Anurag Vohra', age: 30});
                console.log(t0);
                const t15 = await dao.update('test1',{name: 'Anurag Vohra', age: 31})
                console.log(t15);
                const t = await dao.read('test1', 'Anurag Vohra');
                console.log(t);
                const t01 = await dao.read('test1');
                console.log(t01);
                const t1 =  await dao.delete('test1','Anurag Vohra');
                console.log(t1);
                const t2 = await dao.read('test1', 'Adf');
                console.log(t2);
            }
           }catch(e){
               console.log(e);
           }
        })();
*/
