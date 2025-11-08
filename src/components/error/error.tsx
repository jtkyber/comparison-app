const ErrorComponent = ({ msg }: { msg: string | null }) =>
	msg ? <h6 style={{ color: 'red', fontSize: '0.75rem', textAlign: 'center' }}>{msg}</h6> : null;

export default ErrorComponent;
