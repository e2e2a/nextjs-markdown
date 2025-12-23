export const invitationController = {
  handleInvitationAction: async (req: Request, iid: string, wid: string) => {
    try {
      const { intent } = await req.json();

      switch (intent) {
        case 'ACCEPT':
          // We return the NEW member created
          const newMember = await invitationService.acceptInvitation(iid, wid);
          return NextResponse.json({ data: newMember }, { status: 201 });

        case 'REJECT':
          // We return a success message because the object is gone
          await invitationService.rejectInvitation(iid);
          return NextResponse.json(
            { message: 'Invitation rejected successfully' },
            { status: 200 }
          );

        case 'CANCEL':
          // Admin action
          await invitationService.cancelInvitation(iid, wid);
          return NextResponse.json({ message: 'Invitation cancelled' }, { status: 200 });

        default:
          throw new Error('Unsupported Intent');
      }
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  },
};
