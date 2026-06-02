export type SigningAlgorithm = "RS256";

type SigningKeyProps = {
  id: string;
  kid: string;
  algorithm: SigningAlgorithm;
  publicKeyPem: string;
  privateKeyPem: string;
  active: boolean;
  createdAt: Date;
};

export class SigningKey {
  private constructor(private readonly props: SigningKeyProps) {}

  static create(props: SigningKeyProps): SigningKey {
    return new SigningKey(props);
  }

  get id() {
    return this.props.id;
  }

  get kid() {
    return this.props.kid;
  }

  get algorithm() {
    return this.props.algorithm;
  }

  get publicKeyPem() {
    return this.props.publicKeyPem;
  }

  get privateKeyPem() {
    return this.props.privateKeyPem;
  }

  get active() {
    return this.props.active;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
