function Button({ text, onClick,  ...others }) {
    return (
        <button
          onClick={onClick}
          type="button"
          style={{ padding: "0.5rem 1rem", margin: "0.5rem" }}
          {...others}
        >
          {text}
        </button>
      
      );
    };
    
    export default Button;