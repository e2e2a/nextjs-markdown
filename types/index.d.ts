export type User = {
  _id?: string;
  email: string;
  username: string;
  email_verified: boolean;
  role: string;
};

export type IProfile = {
  _id?: string;
  userId: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  kbaQuestion?: string;
  kbaAnswer?: string;
};

export type CreateProfileDTO = IProfile;

export type CreateNodeDTO = {
  userId?: string;
  projectId: string;
  parentId?: string | null;
  projects?: IProject[] | [];
  type: string;
  title?: string;
};

export type INode = {
  _id: string;
  userId?: string;
  projectId: string;
  parentId: string;
  type: string;
  children: INode[];
  title?: string | null;
  content?: string | null;
  archived?: {
    isArchived: boolean;
    archivedAt?: Date;
    archivedBy?: mongoose.Schema.Types.ObjectId;
  };
};

export type UpdateNodeDTO = Pick<INode, '_id' | 'title' | 'content' | 'archived' | 'userId'>;

export type IProject = {
  _id: string;
  userId: string;
  title: string;
  nodes: INode[];
  members?: string[];
  archived: {
    isArchived: boolean;
    archivedAt?: Date;
    archivedBy?: string;
  };
};

export type CreateProjectDTO = Partial<IProject>;
export type UpdateProjectDTO = Pick<INode, 'title'>;
export type ProjectPushNodeDTO = Partial<IProject>;

export type IAccessRecord = {
  userId: string;
  ip: string;
  deviceType: string;
  browser?: string;
  os?: string;
  userAgent?: string;
  lastLogin: Date;
};

export type CreateAccessRecordDTO = IAccessRecord;

export type KBAData = {
  kbaQuestion: string;
  kbaAnswer: string;
};

export type ArchivedItem = {
  _id: string;
  type: string;
  title: string;
  size?: string;
  projectId?: string;
  parentId?: string;
  userId?: string;
  path: string;
  archived: {
    isArchived: boolean;
    archivedAt?: Date;
    archivedBy?: Pick<User, 'email'>;
  };
};

export interface BreadcrumbItem {
  title: string | undefined;
  _id: string;
  parentId: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href?: string;
  type?: string;
  items?: NavItem[];
  isActive?: boolean;
}
