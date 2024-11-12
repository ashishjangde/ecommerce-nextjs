 const handleDatabaseOperation = async <T>(operation: () => Promise<T>): Promise<T> => {
    return Promise.resolve(operation()).catch(error => {
        throw new Error(error);
    });
};


export default handleDatabaseOperation;