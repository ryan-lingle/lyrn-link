class UpdateRecordReferenceOnActiveStorageAttachments < ActiveRecord::Migration[6.0]
  def change
  	remove_reference :active_storage_attachments, :record, polymorphic: true, index: false
  	add_reference :active_storage_attachments, :record, polymorphic: true, index: false, type: :uuid
  end
end
