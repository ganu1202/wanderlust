class ExpressError extends Error{
    constructor(status,message){
        super();                        //calls constructor of parent class,. This initializes any properties or behavior defined in the Error class before adding properties specific to the ExressError class.
        this.status=status;
        this.message=message;
    }
}

module.exports=ExpressError;


// he super() keyword in JavaScript serves two primary purposes:

// Calls superclass constructor: It invokes the constructor of the superclass, ensuring that any initialization logic defined in the superclass is executed.

// Grants access to superclass properties and behavior: It provides the subclass with access to the properties and methods defined in the superclass, 
// allowing the subclass to reuse or extend the functionality provided by the superclass.